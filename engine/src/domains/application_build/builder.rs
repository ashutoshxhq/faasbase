use super::model::{ApplicationBuildContext, ClusterProviderConfig};
use crate::domains::application_generator::service::ApplicationGeneratorService;
use crate::extras::types::{ApplicationResourceConfig, Error};
use aws_config::meta::region::RegionProviderChain;
use aws_credential_types::Credentials;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::{Client, Region};
use base64::{engine::general_purpose, Engine as _};
use bollard::auth::DockerCredentials;
use bollard::image::BuildImageOptions;
use bollard::Docker;
use futures_util::stream::StreamExt;
use std::ffi::OsStr;
use std::fs::{self, File};
use std::io::{self, prelude::*};
use std::path::{Component, Path, PathBuf};
use std::str;
use walkdir::WalkDir;
use zip::write::FileOptions;

#[derive(Clone)]
pub struct ApplicationBuilder {
    pub context: ApplicationBuildContext,
}

impl ApplicationBuilder {
    pub fn new(context: ApplicationBuildContext) -> Self {
        Self { context }
    }

    pub fn setup_directories(&self) -> Result<(), Error> {
        let application = self.context.clone();

        if !Path::new(&format!(
            "temp/applications/{}/{}/src",
            application.id, application.name
        ))
        .exists()
        {
            fs::create_dir_all(std::env::current_dir()?.join(format!(
                "temp/applications/{}/{}/src",
                application.id, application.name
            )))?;
        }

        if !Path::new(&format!(
            "temp/applications/{}/{}/lib/temp",
            application.id, application.name
        ))
        .exists()
        {
            fs::create_dir_all(std::env::current_dir()?.join(format!(
                "temp/applications/{}/{}/lib/temp",
                application.id, application.name
            )))?;
        }

        Ok(())
    }

    pub async fn download_functions(&self) -> Result<(), Error> {
        let application = self.context.clone();
        let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));
        let shared_config = aws_config::from_env().region(region_provider).load().await;
        let s3_client = Client::new(&shared_config);

        for resource in application.resources {
            if let Some(resource_id) = resource.resource_id {
                if let Some(application_resource_config) = resource.config {
                    let config: ApplicationResourceConfig =
                        serde_json::from_value(application_resource_config)?;

                    let object = s3_client
                        .get_object()
                        .bucket("faasly-functions".to_string())
                        .key(format!("{}/{}/function.zip", resource_id, config.version))
                        .send()
                        .await?;

                    let data = object.body.collect().await?;
                    let mut file = File::create(format!(
                        "temp/applications/{}/{}/lib/temp/{}.zip",
                        application.id, application.name, resource_id
                    ))?;
                    file.write_all(&data.into_bytes())?;

                    // Unzip the file
                    let mut archive = zip::ZipArchive::new(File::open(format!(
                        "temp/applications/{}/{}/lib/temp/{}.zip",
                        application.id, application.name, resource_id
                    ))?)?;

                    for i in 0..archive.len() {
                        let mut file = archive.by_index(i)?;
                        let outpath = match file.enclosed_name() {
                            Some(path) => path.to_owned(),
                            None => continue,
                        };

                        let outpath = PathBuf::from(format!(
                            "temp/applications/{}/{}/lib/{}/{}",
                            application.id,
                            application.name,
                            resource.resource_name,
                            outpath.display()
                        ));

                        {
                            let comment = file.comment();
                            if !comment.is_empty() {
                                println!("File {i} comment: {comment}");
                            }
                        }

                        if (*file.name()).ends_with('/') {
                            println!("File {} extracted to \"{}\"", i, outpath.display());
                            fs::create_dir_all(&outpath)?;
                        } else {
                            println!(
                                "File {} extracted to \"{}\" ({} bytes)",
                                i,
                                outpath.display(),
                                file.size()
                            );
                            if let Some(p) = outpath.parent() {
                                if !p.exists() {
                                    fs::create_dir_all(&p)?;
                                }
                            }
                            let mut outfile = fs::File::create(&outpath)?;
                            io::copy(&mut file, &mut outfile)?;
                        }
                    }
                } else {
                    tracing::error!("Resource config is not present");
                }
            } else {
                tracing::error!("Resource ID is not present");
            }
        }
        fs::remove_dir_all(format!(
            "temp/applications/{}/{}/lib/temp",
            application.id, application.name
        ))?;
        Ok(())
    }

    pub async fn generate_application(&self) -> Result<(), Error> {
        let application_generator = ApplicationGeneratorService::new();
        application_generator.generate_application(self.context.clone())?;
        Ok(())
    }

    pub async fn push_application_to_s3(&self) -> Result<(), Error> {
        let application = self.context.clone();
        let application_path = format!("./temp/applications/{}/application.zip", application.id);
        let application_zip = Path::new(&application_path);
        let file = File::create(&application_zip)?;

        let walkdir = WalkDir::new(&format!("./temp/applications/{}/", application.id));
        let it = walkdir.into_iter();

        let mut zip = zip::ZipWriter::new(file);
        let options = FileOptions::default()
            .compression_method(zip::CompressionMethod::Stored)
            .unix_permissions(0o755);

        let mut buffer = Vec::new();
        for entry in it.filter_map(|e| e.ok()) {
            let path = entry.path();
            let name = path.strip_prefix(Path::new(&format!(
                "./temp/applications/{}/",
                application.id
            )))?;

            if path.is_file() {
                if !(name.components().nth(0)
                    == Some(Component::Normal(OsStr::new("application.zip"))))
                {
                    #[allow(deprecated)]
                    zip.start_file_from_path(name, options)?;
                    let mut f = File::open(path)?;

                    f.read_to_end(&mut buffer)?;
                    zip.write_all(&*buffer)?;
                    buffer.clear();
                }
            } else if !name.as_os_str().is_empty() {
                if !(name.components().nth(0)
                    == Some(Component::Normal(OsStr::new("application.zip"))))
                {
                    #[allow(deprecated)]
                    zip.add_directory_from_path(name, options)?;
                }
            }
        }

        zip.finish()?;

        let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));

        let shared_config = aws_config::from_env().region(region_provider).load().await;

        let client = Client::new(&shared_config.clone());

        let body = ByteStream::from_path(Path::new(&application_path.clone())).await?;
        let _res = client
            .put_object()
            .set_bucket(Some("faasly-applications".to_string()))
            .set_key(Some(format!(
                "{}/{}/application.zip",
                application.id, application.build_version
            )))
            .set_body(Some(body))
            .send()
            .await?;

        fs::remove_file(&application_path)?;
        Ok(())
    }

    pub async fn build_docker_image(&self) -> Result<(), Error> {
        let application = self.context.clone();

        let docker = Docker::connect_with_socket_defaults()?;

        let application_path = std::env::current_dir()?.join(format!(
            "temp/applications/{}/{}/",
            application.id, application.name
        ));

        let mut tar = tar::Builder::new(Vec::new());
        tar.append_dir_all(".", &application_path)?;
        let uncompressed = tar.into_inner()?;
        let mut c = flate2::write::GzEncoder::new(Vec::new(), flate2::Compression::default());
        c.write_all(&uncompressed)?;
        let compressed = c.finish()?;

        let cluster_data = self.context.cluster.clone();
        let mut application_cluster_provider_config: Option<ClusterProviderConfig> = None;

        if let Some(cluster_data) = cluster_data {
            application_cluster_provider_config =
                Some(serde_json::from_value(cluster_data.provider_config)?);
        }

        if let Some(application_cluster_provider_config) = application_cluster_provider_config {
            // create shared config with aws creds in application_cluster_provider_config
            let access_key_id = application_cluster_provider_config.aws_access_key_id;
            let secret_access_key = application_cluster_provider_config.aws_secret_access_key;

            if let Some(access_key_id) = access_key_id {
                if let Some(secret_access_key) = secret_access_key {
                    if let Some(region) = application_cluster_provider_config.region {
                        let region_provider = RegionProviderChain::first_try(Region::new(region));
                        let credentials_provider = Credentials::new(
                            access_key_id,
                            secret_access_key,
                            None,
                            None,
                            "faasly",
                        );

                        let shared_config = aws_config::from_env()
                            .credentials_provider(credentials_provider)
                            .region(region_provider)
                            .load()
                            .await;

                        let ecr_client = aws_sdk_ecr::Client::new(&shared_config);

                        let respositories = ecr_client
                            .describe_repositories()
                            .repository_names(self.context.name.clone())
                            .send()
                            .await?;

                        let mut application_repository_uri: Option<String> = None;

                        if let Some(respositories) = respositories.repositories() {
                            for repository in respositories {
                                if let Some(repository_uri) = repository.repository_uri() {
                                    application_repository_uri = Some(repository_uri.to_string());
                                }
                            }
                        }

                        if application_repository_uri.is_none() {
                            let create_repository_output = ecr_client
                                .create_repository()
                                .repository_name(self.context.name.clone())
                                .send()
                                .await?;
                            if let Some(repository) = create_repository_output.repository() {
                                if let Some(repository_uri) = repository.repository_uri() {
                                    application_repository_uri = Some(repository_uri.to_string());
                                }
                            }
                            let build_image_options = BuildImageOptions {
                                dockerfile: "Dockerfile",
                                t: &format!(
                                    "{}:{}",
                                    application_repository_uri.unwrap(),
                                    self.context.build_version
                                ),
                                ..Default::default()
                            };

                            let mut image_build_stream = docker.build_image(
                                build_image_options,
                                None,
                                Some(compressed.into()),
                            );

                            while let Some(msg) = image_build_stream.next().await {
                                tracing::info!("Build: {:?}", msg);
                            }
                        }
                    } else {
                        tracing::error!("No region found in cluster provider config");
                    }
                } else {
                    tracing::error!("No secret access key found in cluster provider config");
                }
            } else {
                tracing::error!("No access key id found in cluster provider config");
            }
        } else {
            tracing::error!("No cluster provider config found");
        }

        Ok(())
    }

    pub async fn push_docker_image(&self) -> Result<(), Error> {
        let cluster_data = self.context.cluster.clone();
        let mut application_cluster_provider_config: Option<ClusterProviderConfig> = None;

        if let Some(cluster_data) = cluster_data {
            application_cluster_provider_config =
                Some(serde_json::from_value(cluster_data.provider_config)?);
        }

        if let Some(application_cluster_provider_config) = application_cluster_provider_config {
            // create shared config with aws creds in application_cluster_provider_config
            let access_key_id = application_cluster_provider_config.aws_access_key_id;
            let secret_access_key = application_cluster_provider_config.aws_secret_access_key;

            if let Some(access_key_id) = access_key_id {
                if let Some(secret_access_key) = secret_access_key {
                    if let Some(region) = application_cluster_provider_config.region {
                        let region_provider = RegionProviderChain::first_try(Region::new(region.clone()));
                        let credentials_provider = Credentials::new(
                            access_key_id,
                            secret_access_key,
                            None,
                            None,
                            "faasly",
                        );

                        let shared_config = aws_config::from_env()
                            .credentials_provider(credentials_provider)
                            .region(region_provider)
                            .load()
                            .await;

                        let docker = Docker::connect_with_socket_defaults()?;
                        let ecr_client = aws_sdk_ecr::Client::new(&shared_config);

                        let respositories = ecr_client
                            .describe_repositories()
                            .repository_names(self.context.name.clone())
                            .send()
                            .await?;
                        // println!("Respositories: {:?}", respositories.repositories());
                        let mut application_repository_uri: Option<String> = None;
                        let mut application_registry_id: Option<String> = None;

                        if let Some(respositories) = respositories.repositories() {
                            for repository in respositories {
                                if let Some(repository_uri) = repository.repository_uri() {
                                    application_repository_uri = Some(repository_uri.to_string());
                                }
                                if let Some(registry_id) = repository.registry_id() {
                                    application_registry_id = Some(registry_id.to_string());
                                }
                            }
                        }

                        if application_repository_uri.is_none() {
                            let create_repository_output = ecr_client
                                .create_repository()
                                .repository_name(self.context.name.clone())
                                .send()
                                .await?;
                            if let Some(repository) = create_repository_output.repository() {
                                if let Some(repository_uri) = repository.repository_uri() {
                                    application_repository_uri = Some(repository_uri.to_string());
                                }
                                if let Some(registry_id) = repository.registry_id() {
                                    application_registry_id = Some(registry_id.to_string());
                                }
                            }
                        }

                        let ecr_authorization_token_output =
                            ecr_client.get_authorization_token().send().await?;
                        let ecr_authorization_data =
                            ecr_authorization_token_output.authorization_data();
                        let mut ecr_token = String::new();
                        if let Some(ecr_authorization_data) = ecr_authorization_data {
                            for ecr_auth_data in ecr_authorization_data {
                                if let Some(token) = ecr_auth_data.authorization_token() {
                                    let bytes = general_purpose::STANDARD.decode(token)?;
                                    ecr_token = match str::from_utf8(&bytes) {
                                        Ok(v) => v.to_string().split(":").collect::<Vec<&str>>()[1]
                                            .to_string(),
                                        Err(e) => panic!("Invalid UTF-8 sequence: {}", e),
                                    };
                                }
                            }
                        }
                        let mut push_res = docker.push_image::<String>(
                            &format!(
                                "{}:{}",
                                application_repository_uri.unwrap(),
                                self.context.build_version
                            ),
                            None,
                            Some(DockerCredentials {
                                serveraddress: Some(format!(
                                    "{}.dkr.ecr.{}.amazonaws.com",
                                    application_registry_id.unwrap(),
                                    region
                                )),
                                username: Some("AWS".to_string()),
                                password: Some(ecr_token),
                                ..Default::default()
                            }),
                        );

                        while let Some(msg) = push_res.next().await {
                            tracing::info!("Push: {:?}", msg);
                        }
                    } else {
                        tracing::error!("No secret access key found in cluster provider config");
                    }
                } else {
                    tracing::error!("No region found in cluster provider config");
                }
            } else {
                tracing::error!("No access key id found in cluster provider config");
            }
        } else {
            tracing::error!("No cluster provider config found to push image to");
        }

        Ok(())
    }

    pub async fn deploy_application(&self) -> Result<(), Error> {
        Ok(())
    }
}

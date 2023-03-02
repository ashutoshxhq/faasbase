use aws_config::meta::region::RegionProviderChain;
use aws_credential_types::Credentials;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::{Client, Region};
use base64::{engine::general_purpose, Engine as _};
use bollard::auth::DockerCredentials;
use bollard::image::BuildImageOptions;
use bollard::Docker;
use chrono::Utc;
use futures_util::stream::StreamExt;
use k8s_openapi::api::apps::v1::Deployment;
use k8s_openapi::api::core::v1::{Secret, Service};
use kube::config::{KubeConfigOptions, Kubeconfig};
use kube::{
    api::{Api, Patch, PatchParams, PostParams},
    Client as KubeClient, Config as KubeConfig,
};
use serde_json::{json, Value};
use std::collections::HashMap;
use std::ffi::OsStr;
use std::fs::{self, File};
use std::io::{self, prelude::*};
use std::path::{Component, Path, PathBuf};
use std::str;
use walkdir::WalkDir;
use zip::write::FileOptions;

use crate::engine_client::update_application_build;
use crate::generator::ApplicationGeneratorService;
use crate::types::{
    ApplicationBuildContext, ApplicationResourceConfig, ApplicationVariables,
    ClusterProviderConfig, Error, FaasbaseError, UpdateApplicationBuild,
};

#[derive(Clone)]
pub struct ApplicationBuilder {
    pub context: ApplicationBuildContext,
    pub auth_token: String,
}

impl ApplicationBuilder {
    pub fn new(context: ApplicationBuildContext, auth_token: String) -> Self {
        Self {
            context,
            auth_token,
        }
    }

    pub async fn build(&self) -> Result<(), Error> {
        let application_build_context = self.context.clone();
        let application_builder = self.clone();
        let auth_token = self.auth_token.clone();

        tokio::spawn(async move {
            let setup_envs = application_builder.setup_envs();

            match setup_envs {
                Ok(_) => {}
                Err(err) => {
                    let log = json!({
                        "message": "Error setting up envs",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    let mut logs_store: Vec<serde_json::Value> = Vec::new();
                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error setting up envs");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "ENV_SETUP_ERR".to_string(),
                        "Something went wrong setting up env".to_string(),
                        400,
                    ));
                }
            }

            let setup_directories = application_builder.setup_directories();
            let mut logs_store: Vec<serde_json::Value> = Vec::new();

            match setup_directories {
                Ok(_) => {}
                Err(err) => {
                    let log = json!({
                        "message": "Error setting up directories",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error setting up directories");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "DIR_SETUP_ERR".to_string(),
                        "Something went wrong setting up directories".to_string(),
                        400,
                    ));
                }
            }

            let download_functions = application_builder.download_functions().await;

            match download_functions {
                Ok(_) => {}
                Err(err) => {
                    let log = json!({
                        "message": "Error downloading functions",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error downloading functions");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };
                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "FUNCTION_DOWNLOAD_ERR".to_string(),
                        "Something went wrong downloading functions".to_string(),
                        400,
                    ));
                }
            }

            let generate_application = application_builder.generate_application().await;

            match generate_application {
                Ok(_) => {}
                Err(err) => {
                    let log = json!({
                        "message": "Error generating application",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error generating application");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "APPLICATION_GENERATE_ERR".to_string(),
                        "Something went wrong setting up env".to_string(),
                        400,
                    ));
                }
            }

            let push_application_to_s3 = application_builder.push_application_to_s3().await;

            match push_application_to_s3 {
                Ok(_) => {}
                Err(err) => {
                    let log = json!({
                        "message": "Error pushing application to s3",
                        "error" : err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error pushing application to s3");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "S3_PUSH_ERR".to_string(),
                        "Something went wrong pushing application to s3".to_string(),
                        400,
                    ));
                }
            }

            let build_docker_image_res = application_builder.build_docker_image().await;

            match build_docker_image_res {
                Ok(res) => {
                    for log in res {
                        logs_store.push(log.clone());
                    }
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::info!("Docker image built successfully");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("SUCCESS".to_string()),
                        deployment_status: Some("DEPLOYING".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        built_at: Some(Utc::now().naive_utc()),
                        deployed_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;
                }
                Err(err) => {
                    let log = json!({
                        "message": "Error building docker image",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());
                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error building docker image");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "DOCKER_BUILD_ERR".to_string(),
                        "Something went wrong building docker image".to_string(),
                        400,
                    ));
                }
            }

            // update application status

            let push_docker_image_res = application_builder.push_docker_image().await;

            match push_docker_image_res {
                Ok(res) => {
                    let log = json!({
                        "message": "Pushed docker image",
                        "timestamp": Utc::now().naive_utc(),
                        "level": "info"
                    });

                    for log in res {
                        logs_store.push(log.clone());
                    }
                    logs_store.push(log.clone());

                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("SUCCESS".to_string()),
                        deployment_status: Some("DEPLOYING".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        built_at: Some(Utc::now().naive_utc()),
                        deployed_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;
                }
                Err(err) => {
                    let log = json!({
                        "message": "Error pushing docker image",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());

                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error pushing docker image");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "DOCKER_PUSH_ERR".to_string(),
                        "Something went wrong pushing docker image".to_string(),
                        400,
                    ));
                }
            }

            let deploy_application = application_builder.deploy_application().await;

            match deploy_application {
                Ok(_) => {
                    let log = json!({
                        "message": "Deployed application",
                        "timestamp": Utc::now().naive_utc(),
                        "level": "info"
                    });

                    logs_store.push(log.clone());

                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::info!("Deployed application");

                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("SUCCESS".to_string()),
                        deployment_status: Some("DEPLOYING".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        built_at: Some(Utc::now().naive_utc()),
                        deployed_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    Ok(())
                }
                Err(err) => {
                    let log = json!({
                        "message": "Error deploying application",
                        "error": err.to_string(),
                        "timestamp": Utc::now().naive_utc(),
                        "level": "error"
                    });

                    logs_store.push(log.clone());

                    let logs =
                        serde_json::to_value(logs_store.clone()).map_or_else(|_e| json!({}), |v| v);

                    tracing::error!("Error deploying application");
                    let build_update_payload = UpdateApplicationBuild {
                        version: application_build_context.build_version.clone(),
                        build_status: Some("ERROR".to_string()),
                        deployment_status: Some("ERROR".to_string()),
                        changelog: None,
                        config: None,
                        logs: Some(logs),
                        deleted_at: None,
                        deployed_at: Some(Utc::now().naive_utc()),
                        built_at: None,
                    };

                    let _update_build_res = update_application_build(
                        application_build_context.id.to_string(),
                        application_build_context.application_build_id.to_string(),
                        build_update_payload,
                        auth_token.clone(),
                    )
                    .await;

                    return Err(FaasbaseError::new(
                        "DEPLOY_ERR".to_string(),
                        "Something went wrong deploying application".to_string(),
                        400,
                    ));
                }
            }
        });

        Ok(())
    }

    pub fn setup_envs(&self) -> Result<(), Error> {
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
            let aws_region = application_cluster_provider_config.region;

            if let Some(access_key_id) = access_key_id.clone() {
                if let Some(secret_access_key) = secret_access_key.clone() {
                    if let Some(aws_region) = aws_region.clone() {
                        std::env::set_var("AWS_ACCESS_KEY_ID", access_key_id.clone());
                        std::env::set_var("AWS_SECRET_ACCESS_KEY", secret_access_key.clone());
                        std::env::set_var("AWS_REGION", aws_region.clone());
                        let aws_config_file = format!(
                            "[default]\naws_access_key_id = {}\naws_secret_access_key = {}\nregion = {}\noutput = json",
                            access_key_id, secret_access_key, aws_region
                        );
                        
                        let home_dir_path = dirs::home_dir();

                        if let Some(home_dir_path) = home_dir_path {
                            let mut config_path = home_dir_path.clone();
                            config_path.push(Path::new(".aws/config"));

                            let aws_dir_path = format!("{}/.aws", home_dir_path.to_str().unwrap());

                            fs::create_dir_all(aws_dir_path)?;
                            std::fs::write(config_path, aws_config_file)?;
                        } else {
                            tracing::error!("No home directory found");
                            return Err(FaasbaseError::new(
                                "BAD_HOME_DIR".to_string(),
                                "No home directory found".to_string(),
                                400,
                            ));
                        }
                    } else {
                        tracing::error!("No region found in cluster provider config");
                        return Err(FaasbaseError::new(
                            "BAD_CLUSTER_CONFIG".to_string(),
                            "No region found in cluster provider config".to_string(),
                            400,
                        ));
                    }
                } else {
                    tracing::error!("No secret access key found in cluster provider config");
                    return Err(FaasbaseError::new(
                        "BAD_CLUSTER_CONFIG".to_string(),
                        "No secret access key found in cluster provider config".to_string(),
                        400,
                    ));
                }
            } else {
                tracing::error!("No access key found in cluster provider config");
                return Err(FaasbaseError::new(
                    "BAD_CLUSTER_CONFIG".to_string(),
                    "No access key found in cluster provider config".to_string(),
                    400,
                ));
            }
        } else {
            tracing::error!("No cluster provider config found");
            return Err(FaasbaseError::new(
                "BAD_CLUSTER_CONFIG".to_string(),
                "No cluster provider config found".to_string(),
                400,
            ));
        }

        Ok(())
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
        let access_key_id = std::env::var("FAASBASE_AWS_ACCESS_KEY_ID")?;
        let secret_access_key = std::env::var("FAASBASE_AWS_SECRET_ACCESS_KEY")?;
        let aws_region = std::env::var("FAASBASE_AWS_DEFAULT_REGION")?;
        let region_provider = RegionProviderChain::first_try(Region::new(aws_region));
        let credentials_provider =
            Credentials::new(access_key_id, secret_access_key, None, None, "faasbase");

        let shared_config = aws_config::from_env()
            .credentials_provider(credentials_provider)
            .region(region_provider)
            .load()
            .await;
        let s3_client = Client::new(&shared_config);

        for resource in application.resources {
            if let Some(resource_id) = resource.resource_id {
                if let Some(application_resource_config) = resource.config {
                    let config: ApplicationResourceConfig =
                        serde_json::from_value(application_resource_config)?;

                    let object = s3_client
                        .get_object()
                        .bucket("faasbase-functions".to_string())
                        .key(format!(
                            "{}/{}/function.zip",
                            resource_id,
                            config.version.unwrap()
                        ))
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

        let access_key_id = std::env::var("FAASBASE_AWS_ACCESS_KEY_ID")?;
        let secret_access_key = std::env::var("FAASBASE_AWS_SECRET_ACCESS_KEY")?;
        let aws_region = std::env::var("FAASBASE_AWS_DEFAULT_REGION")?;
        let region_provider = RegionProviderChain::first_try(Region::new(aws_region));
        let credentials_provider =
            Credentials::new(access_key_id, secret_access_key, None, None, "faasbase");

        let shared_config = aws_config::from_env()
            .credentials_provider(credentials_provider)
            .region(region_provider)
            .load()
            .await;

        let client = Client::new(&shared_config.clone());

        let body = ByteStream::from_path(Path::new(&application_path.clone())).await?;
        let _res = client
            .put_object()
            .set_bucket(Some("faasbase-applications".to_string()))
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

    pub async fn build_docker_image(&self) -> Result<Vec<Value>, Error> {
        let application = self.context.clone();

        let docker = Docker::connect_with_http_defaults()?;

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
                            "faasbase",
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
                            .await;

                        let mut application_repository_uri: Option<String> = None;

                        match respositories {
                            Ok(respositories) => {
                                if let Some(respositories) = respositories.repositories() {
                                    for repository in respositories {
                                        if let Some(repository_uri) = repository.repository_uri() {
                                            tracing::info!("Repository uri: {:?}", repository_uri);
                                            application_repository_uri =
                                                Some(repository_uri.to_string());
                                        }
                                    }
                                }
                            }
                            Err(_) => {
                                if application_repository_uri.is_none() {
                                    let create_repository_output = ecr_client
                                        .create_repository()
                                        .repository_name(self.context.name.clone())
                                        .send()
                                        .await?;
                                    if let Some(repository) = create_repository_output.repository()
                                    {
                                        if let Some(repository_uri) = repository.repository_uri() {
                                            application_repository_uri =
                                                Some(repository_uri.to_string());
                                        }
                                    }
                                }
                            }
                        }

                        if let Some(application_repository_uri) = application_repository_uri {
                            let build_image_options = BuildImageOptions {
                                dockerfile: "Dockerfile",
                                t: &format!(
                                    "{}:{}",
                                    application_repository_uri, self.context.build_version
                                ),
                                ..Default::default()
                            };

                            let mut image_build_stream = docker.build_image(
                                build_image_options,
                                None,
                                Some(compressed.into()),
                            );

                            let mut logs: Vec<Value> = Vec::new();

                            while let Some(msg) = image_build_stream.next().await {
                                match msg {
                                    Ok(stream) => {
                                        tracing::info!("Build: {:?}", stream);
                                        let log = json!({
                                            "stream": stream.stream,
                                            "status": stream.status,
                                            "progress": stream.progress,
                                            "progress_detail": stream.progress_detail,
                                            "error": stream.error,
                                            "error_detail": stream.error_detail,
                                        });
                                        logs.push(log);
                                    }
                                    Err(e) => {
                                        tracing::error!("Build: {:?}", e);
                                        let log = json!({
                                            "error": e.to_string(),
                                        });
                                        logs.push(log);
                                    }
                                }
                            }
                            Ok(logs)
                        } else {
                            tracing::error!("No repository uri found");
                            Err(FaasbaseError::new(
                                "NO_REPOSITORY_URI".to_string(),
                                "No repository uri found".to_string(),
                                400,
                            ))
                        }
                    } else {
                        tracing::error!("No region found in cluster provider config");
                        Err(FaasbaseError::new(
                            "BAD_CLUSTER_CONFIG".to_string(),
                            "No region found in cluster provider config".to_string(),
                            400,
                        ))
                    }
                } else {
                    tracing::error!("No secret access key found in cluster provider config");
                    Err(FaasbaseError::new(
                        "BAD_CLUSTER_CONFIG".to_string(),
                        "No secret access key found in cluster provider config".to_string(),
                        400,
                    ))
                }
            } else {
                tracing::error!("No access key id found in cluster provider config");
                Err(FaasbaseError::new(
                    "BAD_CLUSTER_CONFIG".to_string(),
                    "No access key id found in cluster provider config".to_string(),
                    400,
                ))
            }
        } else {
            tracing::error!("No cluster provider config found");
            Err(FaasbaseError::new(
                "BAD_CLUSTER_CONFIG".to_string(),
                "No cluster provider config found".to_string(),
                400,
            ))
        }
    }

    pub async fn push_docker_image(&self) -> Result<Vec<Value>, Error> {
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
                        let region_provider =
                            RegionProviderChain::first_try(Region::new(region.clone()));
                        let credentials_provider = Credentials::new(
                            access_key_id,
                            secret_access_key,
                            None,
                            None,
                            "faasbase",
                        );

                        let shared_config = aws_config::from_env()
                            .credentials_provider(credentials_provider)
                            .region(region_provider)
                            .load()
                            .await;

                        let docker = Docker::connect_with_http_defaults()?;
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

                        let mut logs: Vec<Value> = vec![];

                        while let Some(msg) = push_res.next().await {
                            match msg {
                                Ok(msg) => {
                                    tracing::info!("Push: {:?}", msg);
                                    logs.push(json!({
                                        "message": msg,
                                        "type": "info"
                                    }));
                                }
                                Err(e) => {
                                    tracing::error!("Push Error: {:?}", e);
                                    logs.push(json!({
                                        "message": format!("{:?}", e),
                                        "type": "error"
                                    }));
                                }
                            }
                        }
                        Ok(logs)
                    } else {
                        tracing::error!("No secret access key found in cluster provider config");
                        Err(FaasbaseError::new(
                            "BAD_CLUSTER_CONFIG".to_string(),
                            "No secret access key found in cluster provider config".to_string(),
                            400,
                        ))
                    }
                } else {
                    tracing::error!("No region found in cluster provider config");
                    Err(FaasbaseError::new(
                        "BAD_CLUSTER_CONFIG".to_string(),
                        "No region found in cluster provider config".to_string(),
                        400,
                    ))
                }
            } else {
                tracing::error!("No access key id found in cluster provider config");
                Err(FaasbaseError::new(
                    "BAD_CLUSTER_CONFIG".to_string(),
                    "No access key id found in cluster provider config".to_string(),
                    400,
                ))
            }
        } else {
            tracing::error!("No cluster provider config found");
            Err(FaasbaseError::new(
                "BAD_CLUSTER_CONFIG".to_string(),
                "No cluster provider config found".to_string(),
                400,
            ))
        }
    }

    pub async fn deploy_application(&self) -> Result<(), Error> {
        let cluster_data = self.context.cluster.clone();

        if let Some(cluster_data) = cluster_data {
            let application_cluster_provider_config: Option<ClusterProviderConfig> =
                Some(serde_json::from_value(cluster_data.provider_config)?);

            if let Some(application_cluster_provider_config) = application_cluster_provider_config {
                // create shared config with aws creds in application_cluster_provider_config
                let access_key_id = application_cluster_provider_config.aws_access_key_id;
                let secret_access_key = application_cluster_provider_config.aws_secret_access_key;

                if let Some(access_key_id) = access_key_id {
                    if let Some(secret_access_key) = secret_access_key {
                        if let Some(region) = application_cluster_provider_config.region {
                            let region_provider =
                                RegionProviderChain::first_try(Region::new(region.clone()));
                            let credentials_provider = Credentials::new(
                                access_key_id,
                                secret_access_key,
                                None,
                                None,
                                "faasbase",
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
                            // println!("Respositories: {:?}", respositories.repositories());
                            let mut application_repository_uri: Option<String> = None;

                            if let Some(respositories) = respositories.repositories() {
                                for repository in respositories {
                                    if let Some(repository_uri) = repository.repository_uri() {
                                        application_repository_uri =
                                            Some(repository_uri.to_string());
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
                                        application_repository_uri =
                                            Some(repository_uri.to_string());
                                    }
                                }
                            }

                            let mut application_variables: ApplicationVariables =
                                ApplicationVariables {
                                    config_vars: None,
                                    secrets: None,
                                };

                            if let Some(variables) = self.context.variables.clone() {
                                application_variables = serde_json::from_value(variables)?;
                            }

                            let kubeconfig = Kubeconfig::from_yaml(&cluster_data.cluster_config)?;

                            // tracing::info!("Kubeconfig: {:?}", kubeconfig);
                            let options = KubeConfigOptions::default();

                            let config =
                                KubeConfig::from_custom_kubeconfig(kubeconfig, &options).await?;

                            let client = KubeClient::try_from(config)?;

                            // Manage pods
                            let deployments: Api<Deployment> =
                                Api::default_namespaced(client.clone());

                            let mut envs = Vec::new();

                            envs.push(json!({
                                "name": "PORT",
                                "value": "8000"
                            }));

                            if let Some(config_vars) = application_variables.config_vars {
                                for config_var in config_vars {
                                    envs.push(json!({
                                        "name": config_var.key,
                                        "value": config_var.value,
                                    }));
                                }
                            }

                            let deployment_config = serde_json::from_value(json!({
                                "apiVersion": "apps/v1",
                                "kind": "Deployment",
                                "metadata": {
                                    "name": format!("{}-deployment", self.context.name),
                                },
                                "spec": {
                                    "replicas": 1,
                                    "selector": {
                                        "matchLabels": {
                                            "name": format!("{}-pod", self.context.name),
                                            "app": format!("{}", self.context.name),
                                        }
                                    },
                                    "template": {
                                        "metadata": {
                                            "labels": {
                                                "name": format!("{}-pod", self.context.name),
                                                "app": format!("{}", self.context.name),
                                            }
                                        },
                                        "spec": {
                                            "containers": [
                                                {
                                                    "name": format!("{}-container", self.context.name),
                                                    "image": format!("{}:{}", application_repository_uri.unwrap(), self.context.build_version),
                                                    "imagePullPolicy": "Always",
                                                    "ports": [
                                                        {
                                                            "containerPort": 8000
                                                        }
                                                    ],
                                                    "env": envs,
                                                    "envFrom": [
                                                        {
                                                            "secretRef": {
                                                                "name": format!("{}-secret", self.context.name)
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                }
                            }))?;

                            let deployment = deployments
                                .get(&format!("{}-deployment", self.context.name))
                                .await;

                            match deployment {
                                Ok(_deployment) => {
                                    tracing::info!("Deployment already exists, updating");
                                    let patchparams = PatchParams::default();
                                    deployments
                                        .patch(
                                            &format!("{}-deployment", self.context.name),
                                            &patchparams,
                                            &Patch::Merge(&deployment_config),
                                        )
                                        .await?;
                                }
                                Err(_e) => {
                                    tracing::info!(
                                        "Deployment does not exist, creating, error={:?}",
                                        _e
                                    );
                                    deployments
                                        .create(&PostParams::default(), &deployment_config)
                                        .await?;
                                }
                            }

                            let services: Api<Service> = Api::default_namespaced(client.clone());

                            let service_config = serde_json::from_value(json!({
                                "apiVersion": "v1",
                                "kind": "Service",
                                "metadata": {
                                    "name": format!("{}-service", self.context.name),
                                    "labels": {
                                        "app": format!("{}", self.context.name),
                                    }
                                },
                                "spec": {
                                    "type": "LoadBalancer",
                                    "selector": {
                                        "name": format!("{}-pod", self.context.name),
                                        "app": format!("{}", self.context.name),
                                    },
                                    "ports": [
                                        {
                                            "name": "http",
                                            "protocol": "TCP",
                                            "port": 80,
                                            "targetPort": 8000
                                        },
                                        {
                                            "name": "https",
                                            "protocol": "TCP",
                                            "port": 443,
                                            "targetPort": 8000
                                        }
                                    ]
                                }
                            }))?;

                            let service = services
                                .get(&format!("{}-service", self.context.name))
                                .await;

                            match service {
                                Ok(_service) => {
                                    tracing::info!("Service already exists, updating");
                                    let patchparams = PatchParams::default();
                                    services
                                        .patch(
                                            &format!("{}-service", self.context.name),
                                            &patchparams,
                                            &Patch::Merge(&service_config),
                                        )
                                        .await?;
                                }
                                Err(_e) => {
                                    tracing::info!("Service does not exist, creating");
                                    services
                                        .create(&PostParams::default(), &service_config)
                                        .await?;
                                }
                            }

                            let mut secret_map: HashMap<String, String> = HashMap::new();

                            if let Some(secrets) = application_variables.secrets {
                                for secret in secrets {
                                    let encoded_secret: String =
                                        general_purpose::STANDARD.encode(secret.value);
                                    secret_map.insert(secret.key, encoded_secret);
                                }
                            }

                            let secret_config = serde_json::from_value(json!({
                                "apiVersion": "v1",
                                "kind": "Secret",
                                "metadata": {
                                    "name": format!("{}-secret", self.context.name),
                                },
                                "type": "Opaque",
                                "data": secret_map
                            }))?;

                            let secrets: Api<Secret> = Api::default_namespaced(client.clone());

                            let secret =
                                secrets.get(&format!("{}-secret", self.context.name)).await;

                            match secret {
                                Ok(_secret) => {
                                    tracing::info!("Secret already exists, updating");
                                    let patchparams = PatchParams::default();
                                    secrets
                                        .patch(
                                            &format!("{}-secret", self.context.name),
                                            &patchparams,
                                            &Patch::Merge(&secret_config),
                                        )
                                        .await?;
                                }
                                Err(_e) => {
                                    tracing::info!("Secret does not exist, creating");
                                    secrets
                                        .create(&PostParams::default(), &secret_config)
                                        .await?;
                                }
                            }

                            Ok(())
                        } else {
                            tracing::error!("No region found in cluster provider config");
                            Err(FaasbaseError::new(
                                "BAD_CLUSTER_CONFIG".to_string(),
                                "No region found in cluster provider config".to_string(),
                                400,
                            ))
                        }
                    } else {
                        tracing::error!("No secret access key found in cluster provider config");
                        Err(FaasbaseError::new(
                            "BAD_CLUSTER_CONFIG".to_string(),
                            "No secret access key found in cluster provider config".to_string(),
                            400,
                        ))
                    }
                } else {
                    tracing::error!("No access key id found in cluster provider config");
                    Err(FaasbaseError::new(
                        "BAD_CLUSTER_CONFIG".to_string(),
                        "No access key id found in cluster provider config".to_string(),
                        400,
                    ))
                }
            } else {
                tracing::error!("No cluster provider config found");
                Err(FaasbaseError::new(
                    "BAD_CLUSTER_CONFIG".to_string(),
                    "No cluster provider config found".to_string(),
                    400,
                ))
            }
        } else {
            tracing::error!("No cluster provider found");
            Err(FaasbaseError::new(
                "BAD_CLUSTER_CONFIG".to_string(),
                "No cluster provider found".to_string(),
                400,
            ))
        }
    }
}

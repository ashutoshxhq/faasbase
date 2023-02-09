use crate::domains::application::model::Application;
use crate::domains::application_generator::service::ApplicationGeneratorService;
use crate::domains::application_resource::model::ApplicationResourceWithFunction;
use crate::extras::types::{ApplicationResourceConfig, Error};
use crate::schema::application_builds::{self, dsl};
use crate::schema::applications::dsl as application_dsl;
use crate::state::DbPool;
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::{Client, Region};
use diesel::{prelude::*, sql_query};
use zip::write::FileOptions;
use std::ffi::OsStr;
use std::fs::File;
use std::io::prelude::*;
use std::path::{Path, PathBuf, Component};
use std::{fs, io};
use uuid::Uuid;
use walkdir::WalkDir;
use super::model::{
    ApplicationBuild, ApplicationBuildContext, ApplicationBuildWithUser, ApplicationConfig,
    NewApplicationBuild, UpdateApplicationBuild,
};

#[derive(Clone)]
pub struct ApplicationBuildService {
    pub pool: DbPool,
}

impl ApplicationBuildService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_application_build(
        &self,
        application_builds_id: Uuid,
    ) -> Result<ApplicationBuild, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: ApplicationBuild = dsl::application_builds
            .find(application_builds_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_application_builds(
        &self,
        application_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<ApplicationBuildWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select
            ab.id,
            ab.version,
            ab.changelog,
            ab.config,
            u.firstname,
            u.lastname,
            u.email,
            u.profile_pic,
            ab.application_id,
            ab.user_id,
            ab.created_at,
            ab.updated_at,
            ab.deleted_at
        from application_builds ab
        join users u on ab.user_id = u.id
        where ab.application_id = '{}'
        limit {} offset {};",
            application_id.to_string(),
            limit,
            offset
        ))
        .load::<ApplicationBuildWithUser>(&mut conn)?;

        Ok(results)
    }

    pub async fn create_application_build(
        &self,
        application_build_payload: NewApplicationBuild,
    ) -> Result<ApplicationBuild, Error> {
        let mut conn = self.pool.clone().get().unwrap();

        let results: ApplicationBuild = diesel::insert_into(application_builds::table)
            .values(&application_build_payload)
            .get_result(&mut conn)
            .expect("Error saving new application_builds");

        if let Some(application_id) = application_build_payload.application_id {
            let application: Application = application_dsl::applications
                .find(application_id)
                .first(&mut conn)
                .unwrap();

            let application_resources = sql_query(format!(
                "select 
                        application_resources.id,
                        application_resources.resource_type,
                        f.name as resource_name,
                        application_resources.config,
                        application_resources.resource_id,
                        application_resources.application_id,
                        application_resources.created_at,
                        application_resources.updated_at,
                        application_resources.deleted_at
                    from application_resources
                             join functions f on application_resources.resource_id = f.id
                    where application_resources.application_id = '{}';",
                application_id.to_string(),
            ))
            .load::<ApplicationResourceWithFunction>(&mut conn)
            .unwrap();

            if !Path::new(&format!(
                "temp/applications/{}/{}",
                application.id, application.name
            ))
            .exists()
            {
                fs::create_dir_all(std::env::current_dir().unwrap().join(format!(
                    "temp/applications/{}/{}",
                    application.id, application.name
                )))
                .unwrap();
            }

            if !Path::new(&format!(
                "temp/applications/{}/{}/src",
                application.id, application.name
            ))
            .exists()
            {
                fs::create_dir_all(std::env::current_dir().unwrap().join(format!(
                    "temp/applications/{}/{}/src",
                    application.id, application.name
                )))
                .unwrap();
            }

            if !Path::new(&format!("temp/applications/{}/functions", application.id)).exists() {
                fs::create_dir_all(
                    std::env::current_dir()
                        .unwrap()
                        .join(format!("temp/applications/{}/functions", application.id)),
                )
                .unwrap();
            }

            if !Path::new(&format!(
                "temp/applications/{}/functions/temp",
                application.id
            ))
            .exists()
            {
                fs::create_dir_all(std::env::current_dir().unwrap().join(format!(
                    "temp/applications/{}/functions/temp",
                    application.id
                )))
                .unwrap();
            }

            for application_resource in application_resources.clone() {
                let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));

                let shared_config = aws_config::from_env().region(region_provider).load().await;
                let client = Client::new(&shared_config);

                if let Some(resource_id) = application_resource.resource_id {
                    if let Some(application_resource_config) = application_resource.config {
                        let config: ApplicationResourceConfig =
                            serde_json::from_value(application_resource_config).unwrap();

                        let object = client
                            .get_object()
                            .bucket("faasly-functions".to_string())
                            .key(format!("{}/{}/function.zip", resource_id, config.version))
                            .send()
                            .await
                            .unwrap();

                        let data = object.body.collect().await.unwrap();
                        let mut file = File::create(format!(
                            "temp/applications/{}/functions/temp/{}.zip",
                            application.id, resource_id
                        ))
                        .unwrap();
                        file.write_all(&data.into_bytes()).unwrap();

                        // Unzip the file
                        let mut archive = zip::ZipArchive::new(
                            File::open(format!(
                                "temp/applications/{}/functions/temp/{}.zip",
                                application.id, resource_id
                            ))
                            .unwrap(),
                        )
                        .unwrap();

                        for i in 0..archive.len() {
                            let mut file = archive.by_index(i).unwrap();
                            let outpath = match file.enclosed_name() {
                                Some(path) => path.to_owned(),
                                None => continue,
                            };

                            let outpath = PathBuf::from(format!(
                                "temp/applications/{}/functions/{}/{}",
                                application.id,
                                application_resource.resource_name,
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
                                fs::create_dir_all(&outpath).unwrap();
                            } else {
                                println!(
                                    "File {} extracted to \"{}\" ({} bytes)",
                                    i,
                                    outpath.display(),
                                    file.size()
                                );
                                if let Some(p) = outpath.parent() {
                                    if !p.exists() {
                                        fs::create_dir_all(&p).unwrap();
                                    }
                                }
                                let mut outfile = fs::File::create(&outpath).unwrap();
                                io::copy(&mut file, &mut outfile).unwrap();
                            }
                        }

                        fs::remove_dir_all(format!(
                            "temp/applications/{}/functions/temp",
                            application.id
                        ))?;
                        // Generate application code integrating functions
                        // Construct the ApplicationBuildContext with application data and resource data
                        let mut application_build_config: Option<ApplicationConfig> = None;

                        if let Some(application_config) = application.config.clone() {
                            application_build_config =
                                Some(serde_json::from_value(application_config).unwrap());
                        }

                        let application_build_context: ApplicationBuildContext =
                            ApplicationBuildContext {
                                id: application.id,
                                name: application.name.clone(),
                                resources: application_resources.clone(),
                                application_type: application.application_type.clone(),
                                config: application_build_config,
                                variables: application.variables.clone(),
                                created_at: application.created_at,
                                deleted_at: application.deleted_at,
                                updated_at: application.updated_at,
                                description: application.description.clone(),
                                latest_version: application.latest_version.clone(),
                                readme: application.readme.clone(),
                                repository: application.repository.clone(),
                                size: application.size.clone(),
                                user_id: application.user_id,
                                visibility: application.visibility.clone(),
                                website: application.website.clone(),
                                workspace_id: application.workspace_id,
                            };

                        let application_generator = ApplicationGeneratorService::new();
                        application_generator
                            .generate_application(application_build_context)
                            .unwrap();


                        let application_path = format!(
                            "./temp/applications/{}/application.zip",
                            application.id
                        );
                        let application_zip = Path::new(&application_path);
                        let file = File::create(&application_zip).unwrap();

                        let walkdir = WalkDir::new(&format!(
                            "./temp/applications/{}/",
                            application.id
                        ));
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
                            ))).unwrap();

                            if path.is_file() {
                                if !(name.components().nth(0)
                                    == Some(Component::Normal(OsStr::new("application.zip"))))
                                {
                                    #[allow(deprecated)]
                                    zip.start_file_from_path(name, options).unwrap();
                                    let mut f = File::open(path).unwrap();

                                    f.read_to_end(&mut buffer).unwrap();
                                    zip.write_all(&*buffer).unwrap();
                                    buffer.clear();
                                }
                            } else if !name.as_os_str().is_empty() {
                                if !(name.components().nth(0)
                                    == Some(Component::Normal(OsStr::new("application.zip"))))
                                {
                                    #[allow(deprecated)]
                                    zip.add_directory_from_path(name, options).unwrap();
                                }
                            }
                        }

                        zip.finish().unwrap();

                        let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));

                        let shared_config = aws_config::from_env().region(region_provider).load().await;
                        let client = Client::new(&shared_config);
                
                        let body = ByteStream::from_path(Path::new(&application_path.clone()))
                        .await?;
                        let _res = client
                            .put_object()
                            .set_bucket(Some("faasly-applications".to_string()))
                            .set_key(Some(format!("{}/{}/application.zip", application.id, application_build_payload.version)))
                            .set_body(Some(body))
                            .send()
                            .await?;
                
                        fs::remove_file(&application_path)?;

                        // Use docker in docker to build the image for the application using the rust docker library
                        // Push the image to the registry
                        // Save the image details name in the database
                        
                    } else {
                        tracing::error!("No config found for resource {}", resource_id);
                    }
                } else {
                    tracing::error!(
                        "No resource id found for application resource {}",
                        application_resource.id
                    );
                }
            }
        } else {
            tracing::error!("No application id found for application build");
        }

        Ok(results)
    }

    pub fn update_application_build(
        &self,
        application_builds_id: Uuid,
        data: UpdateApplicationBuild,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _application_builds_statement =
            diesel::update(dsl::application_builds.find(application_builds_id))
                .set(&data)
                .get_result::<ApplicationBuild>(&mut conn)?;

        Ok(())
    }

    pub fn delete_application_build(&self, application_builds_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::application_builds.find(application_builds_id))
            .execute(&mut conn)
            .expect("Error deleting application_builds");
        Ok(())
    }
}

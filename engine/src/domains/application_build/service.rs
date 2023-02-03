use crate::domains::application::model::Application;
use crate::domains::application_resource::model::ApplicationResourceWithFunction;
use crate::extras::types::{ApplicationResourceConfig, Error};
use crate::schema::application_builds::{self, dsl};
use crate::schema::applications::dsl as application_dsl;
use crate::state::DbPool;
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::{Client, Region};
use diesel::{prelude::*, sql_query};
use std::fs::File;
use std::io::prelude::*;
use std::path::{Path, PathBuf};
use std::{fs, io};
use uuid::Uuid;

use super::model::{
    ApplicationBuild, ApplicationBuildWithUser, NewApplicationBuild, UpdateApplicationBuild,
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
        data: NewApplicationBuild,
    ) -> Result<ApplicationBuild, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: ApplicationBuild = diesel::insert_into(application_builds::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new application_builds");

        if let Some(application_id) = data.application_id {
            let application: Application = application_dsl::applications
                .find(application_id)
                .first(&mut conn)?;

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
            .load::<ApplicationResourceWithFunction>(&mut conn)?;

            if !Path::new(&format!(
                "temp/applications/{}/{}",
                application.id, application.name
            ))
            .exists()
            {
                fs::create_dir_all(std::env::current_dir()?.join(format!(
                    "temp/applications/{}/{}",
                    application.id, application.name
                )))?;
            }

            if !Path::new(&format!("temp/applications/{}/functions", application.id)).exists() {
                fs::create_dir_all(
                    std::env::current_dir()?
                        .join(format!("temp/applications/{}/functions", application.id)),
                )?;
            }

            for application_resource in application_resources {
                let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));

                let shared_config = aws_config::from_env().region(region_provider).load().await;
                let client = Client::new(&shared_config);

                if let Some(resource_id) = application_resource.resource_id {
                    if let Some(application_resource_config) = application_resource.config {
                        let config: ApplicationResourceConfig =
                            serde_json::from_value(application_resource_config)?;

                        let object = client
                            .get_object()
                            .bucket("faasly-functions".to_string())
                            .key(format!("{}/{}/function.zip", resource_id, config.version))
                            .send()
                            .await?;

                        let data = object.body.collect().await?;
                        let mut file = File::create(format!(
                            "temp/applications/{}/functions/temp/{}.zip",
                            application.id, resource_id
                        ))?;
                        file.write_all(&data.into_bytes())?;

                        // Unzip the file
                        let mut archive = zip::ZipArchive::new(File::open(format!(
                            "temp/applications/{}/functions/temp/{}",
                            application.id, resource_id
                        ))?)?;

                        for i in 0..archive.len() {
                            let mut file = archive.by_index(i)?;
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
                        // Generate application code integrating functions
                        // Use docker in docker to build the image for the application using the rust docker library
                        // Push the image to the registry
                        // Save the image details name in the database
                        // Upload the application build to s3
                        // Save the s3 url in the database
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

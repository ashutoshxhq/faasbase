use super::builder::ApplicationBuilder;
use super::model::{
    ApplicationBuild, ApplicationBuildContext, ApplicationBuildWithUser, ApplicationConfig,
    NewApplicationBuild, UpdateApplicationBuild,
};
use crate::domains::application::model::Application;
use crate::domains::application_resource::model::ApplicationResourceWithFunction;
use crate::domains::cluster::model::Cluster;
use crate::extras::types::Error;
use crate::schema::application_builds::{self, dsl};
use crate::schema::applications::dsl as application_dsl;
use crate::schema::clusters::dsl as cluster_dsl;
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use std::str::FromStr;
use uuid::Uuid;
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

            let mut application_build_config: Option<ApplicationConfig> = None;
            let mut cluster: Option<Cluster> = None;

            if let Some(application_config) = application.config.clone() {
                let application_config_data: ApplicationConfig =
                    serde_json::from_value(application_config).unwrap();

                if let Some(cluster_id) = application_config_data.deployment_target.clone() {
                    let cluster_id = Uuid::from_str(&cluster_id)?;
                    cluster = Some(
                        cluster_dsl::clusters
                            .find(cluster_id)
                            .first(&mut conn)
                            .unwrap(),
                    );
                }

                application_build_config = Some(application_config_data);
            }

            let application_build_context: ApplicationBuildContext = ApplicationBuildContext {
                id: application.id,
                name: application.name.clone(),
                build_version: application_build_payload.version.clone(),
                resources: application_resources.clone(),
                cluster: cluster.clone(),
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

            tokio::spawn(async move {
                let application_builder = ApplicationBuilder::new(application_build_context);
                let setup_directories = application_builder.setup_directories();
                if setup_directories.is_err() {
                    tracing::error!("Error setting up directories");
                    return Err(setup_directories.err().unwrap());
                }

                let download_functions = application_builder.download_functions().await;
                if download_functions.is_err() {
                    tracing::error!("Error downloading functions");
                    return Err(download_functions.err().unwrap());
                }

                let generate_application = application_builder.generate_application().await;
                if generate_application.is_err() {
                    tracing::error!("Error generating application");
                    return Err(generate_application.err().unwrap());
                }

                let push_application_to_s3 = application_builder.push_application_to_s3().await;
                if push_application_to_s3.is_err() {
                    tracing::error!("Error pushing application to s3");
                    return Err(push_application_to_s3.err().unwrap());
                }

                let build_docker_image = application_builder.build_docker_image().await;
                if build_docker_image.is_err() {
                    tracing::error!("Error building docker image");
                    return Err(setup_directories.err().unwrap());
                }

                let push_docker_image = application_builder.push_docker_image().await;
                if push_docker_image.is_err() {
                    tracing::error!("Error pushing docker image");
                    return Err(push_docker_image.err().unwrap());
                }

                let deploy_application = application_builder.deploy_application().await;
                if deploy_application.is_err() {
                    tracing::error!("Error deploying application");
                    return Err(deploy_application.err().unwrap());
                }

                Ok(())
            })
            .await??;
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

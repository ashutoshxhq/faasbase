use crate::extras::types::Error;
use crate::modules::application_collaborator::model::{
    ApplicationCollaborator, NewApplicationCollaborator,
};
use crate::schema::application_collaborators;
use crate::schema::applications::{self, dsl};
use crate::schema::application_stars::dsl::application_stars;


use crate::schema::application_forks::dsl as application_forks_dsl;
use crate::state::DbPool;
use diesel::prelude::*;
use uuid::Uuid;

use super::model::{Application, ForkApplication, NewApplication, UpdateApplication, CreateApplicationFork, ApplicationFork, CreateApplicationStar, ApplicationStar};

#[derive(Clone)]
pub struct ApplicationService {
    pub pool: DbPool,
}

impl ApplicationService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_application(&self, application_id: Uuid) -> Result<Application, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: Application = dsl::applications.find(application_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_applications(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<Application>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results: Vec<Application> = dsl::applications
            .filter(dsl::workspace_id.eq(workspace_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;
        Ok(results)
    }

    pub fn search_applications(
        &self,
        query: String,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<Application>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let applications = dsl::applications;
        let results;
        if query.eq("") {
            results = applications
                .filter(dsl::visibility.eq("PUBLIC"))
                .offset(offset)
                .limit(limit)
                .load(&mut conn)?;
        } else {
            results = applications
                .filter(
                    dsl::name
                        .ilike(format!("%{}%", query.clone()))
                        .or(dsl::description.ilike(format!("%{}%", query.clone())))
                        .or(dsl::readme.ilike(format!("%{}%", query.clone())))
                        .and(dsl::visibility.eq("PUBLIC")),
                )
                .offset(offset)
                .limit(limit)
                .load(&mut conn)?;
        }
        Ok(results)
    }

    pub fn create_application(
        &self,
        data: NewApplication,
        user_id: Uuid,
    ) -> Result<Application, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Application = diesel::insert_into(applications::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new application");

        let _collab: ApplicationCollaborator =
            diesel::insert_into(application_collaborators::table)
                .values(&NewApplicationCollaborator {
                    application_id: results.id,
                    permission: "OWNER".to_string(),
                    collaborator_id: user_id,
                })
                .get_result(&mut conn)
                .expect("Error saving new application_collaborators");
        Ok(results)
    }

    pub fn update_application(
        &self,
        application_id: Uuid,
        data: UpdateApplication,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _application_statement = diesel::update(dsl::applications.find(application_id))
            .set(&data)
            .get_result::<Application>(&mut conn)?;

        Ok(())
    }

    pub fn delete_application(&self, application_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::applications.find(application_id))
            .execute(&mut conn)
            .expect("Error deleting application");
        Ok(())
    }

    pub fn fork_application(&self, data: ForkApplication) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        let application = dsl::applications
            .find(data.application_id)
            .first::<Application>(&mut conn)?;

        let new_application = NewApplication {
            name: data.name,
            description: application.description,
            readme: application.readme,
            workspace_id: Some(data.workspace_id),
            visibility: application.visibility,
            application_type: application.application_type,
            config: None,
            deployed_version: application.deployed_version,
            repository: application.repository,
            size: application.size,
            user_id: Some(data.user_id),
            variables: None,
            website: application.website,
        };

        let _application_statement = diesel::insert_into(dsl::applications)
            .values(&new_application)
            .get_result::<Application>(&mut conn)?;

        let _application_fork_statement = diesel::insert_into(application_forks_dsl::application_forks)
            .values(&CreateApplicationFork{
                source_application_id: data.application_id,
                target_application_id: application.id,
                workspace_id: data.workspace_id,
                user_id: data.user_id,
            })
            .get_result::<ApplicationFork>(&mut conn)?;
        Ok(())
    }

    pub fn star_application(&self, application_id: Uuid, user_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        
        let _application_statement = diesel::insert_into(application_stars)
            .values(&CreateApplicationStar{
                application_id,
                user_id,
            })
            .get_result::<ApplicationStar>(&mut conn)?;

        Ok(())
    }
}

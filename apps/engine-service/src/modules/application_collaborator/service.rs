use crate::extras::types::Error;
use crate::schema::application_collaborators::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{
    ApplicationCollaborator, NewApplicationCollaborator, UpdateApplicationCollaborator, ApplicationCollaboratorWithUser,
};

#[derive(Clone)]
pub struct ApplicationCollaboratorService {
    pub pool: DbPool,
}

impl ApplicationCollaboratorService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_application_collaborator(
        &self,
        application_collaborators_id: Uuid,
    ) -> Result<ApplicationCollaborator, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: ApplicationCollaborator = dsl::application_collaborators
            .find(application_collaborators_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_application_collaborators(
        &self,
        application_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<ApplicationCollaboratorWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select ac.id,
            ac.permission,
            ac.application_id,
            ac.collaborator_id,
            u.firstname,
            u.lastname,
            u.email,
            u.profile_pic,
            ac.created_at,
            ac.updated_at,
            ac.deleted_at
        from application_collaborators ac
              join users u on ac.collaborator_id = u.id
        where ac.application_id = '{}'
        limit {} offset {};",
            application_id.to_string(),
            limit,
            offset
        ))
        .load::<ApplicationCollaboratorWithUser>(&mut conn)?;
        
        Ok(results)
    }

    pub fn create_application_collaborator(
        &self,
        data: NewApplicationCollaborator,
    ) -> Result<ApplicationCollaborator, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: ApplicationCollaborator =
            diesel::insert_into(application_collaborators::table)
                .values(&data)
                .get_result(&mut conn)
                .expect("Error saving new application_collaborators");
        Ok(results)
    }

    pub fn update_application_collaborator(
        &self,
        application_collaborators_id: Uuid,
        data: UpdateApplicationCollaborator,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _application_collaborators_statement =
            diesel::update(dsl::application_collaborators.find(application_collaborators_id))
                .set(&data)
                .get_result::<ApplicationCollaborator>(&mut conn)?;

        Ok(())
    }

    pub fn delete_application_collaborator(
        &self,
        application_collaborators_id: Uuid,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::application_collaborators.find(application_collaborators_id))
            .execute(&mut conn)
            .expect("Error deleting application_collaborators");
        Ok(())
    }
}

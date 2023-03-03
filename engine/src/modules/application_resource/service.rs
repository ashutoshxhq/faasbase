use crate::extras::types::Error;
use crate::schema::application_resources::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{
    ApplicationResource, ApplicationResourceWithFunction, NewApplicationResource,
    UpdateApplicationResource,
};

#[derive(Clone)]
pub struct ApplicationResourceService {
    pub pool: DbPool,
}

impl ApplicationResourceService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_application_resource(
        &self,
        application_resources_id: Uuid,
    ) -> Result<ApplicationResource, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: ApplicationResource = dsl::application_resources
            .find(application_resources_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_application_resources(
        &self,
        application_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<ApplicationResourceWithFunction>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
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
        where application_resources.application_id = '{}'
        limit {} offset {};",
            application_id.to_string(),
            limit,
            offset
        ))
        .load::<ApplicationResourceWithFunction>(&mut conn)?;
        Ok(results)
    }

    pub fn create_application_resource(
        &self,
        data: NewApplicationResource,
    ) -> Result<ApplicationResource, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: ApplicationResource = diesel::insert_into(application_resources::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new application_resources");
        Ok(results)
    }

    pub fn update_application_resource(
        &self,
        application_resources_id: Uuid,
        data: UpdateApplicationResource,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _application_resources_statement =
            diesel::update(dsl::application_resources.find(application_resources_id))
                .set(&data)
                .get_result::<ApplicationResource>(&mut conn)?;

        Ok(())
    }

    pub fn delete_application_resource(&self, application_resources_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::application_resources.find(application_resources_id))
            .execute(&mut conn)
            .expect("Error deleting application_resources");
        Ok(())
    }
}

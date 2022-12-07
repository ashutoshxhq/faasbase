use crate::extras::types::Error;
use crate::schema::application_builds::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{ApplicationBuild, NewApplicationBuild, UpdateApplicationBuild, ApplicationBuildWithUser};

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

    pub fn create_application_build(
        &self,
        data: NewApplicationBuild,
    ) -> Result<ApplicationBuild, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: ApplicationBuild = diesel::insert_into(application_builds::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new application_builds");
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

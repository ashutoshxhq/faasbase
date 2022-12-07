use crate::extras::types::Error;
use crate::schema::function_builds::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{FunctionBuild, NewFunctionBuild, UpdateFunctionBuild, FunctionBuildWithUser};

#[derive(Clone)]
pub struct FunctionBuildService {
    pub pool: DbPool,
}

impl FunctionBuildService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_function_build(&self, function_builds_id: Uuid) -> Result<FunctionBuild, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: FunctionBuild = dsl::function_builds
            .find(function_builds_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_function_builds(
        &self,
        function_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<FunctionBuildWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select fb.id,
            fb.version,
            fb.changelog,
            fb.config,
            fb.function_id,
            fb.user_id,
            u.firstname,
            u.lastname,
            u.email,
            u.profile_pic,
            fb.created_at,
            fb.updated_at,
            fb.deleted_at
        from function_builds fb
              join users u on fb.user_id = u.id
        where fb.function_id = '{}'
        limit {} offset {};",
            function_id.to_string(),
            limit,
            offset
        ))
        .load::<FunctionBuildWithUser>(&mut conn)?;

        Ok(results)
    }

    pub fn create_function_build(&self, data: NewFunctionBuild) -> Result<FunctionBuild, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: FunctionBuild = diesel::insert_into(function_builds::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new function_builds");
        Ok(results)
    }

    pub fn update_function_build(
        &self,
        function_builds_id: Uuid,
        data: UpdateFunctionBuild,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _function_builds_statement =
            diesel::update(dsl::function_builds.find(function_builds_id))
                .set(&data)
                .get_result::<FunctionBuild>(&mut conn)?;

        Ok(())
    }

    pub fn delete_function_build(&self, function_builds_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::function_builds.find(function_builds_id))
            .execute(&mut conn)
            .expect("Error deleting function_builds");
        Ok(())
    }
}

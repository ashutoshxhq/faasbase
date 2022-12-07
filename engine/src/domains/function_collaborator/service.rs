use crate::extras::types::Error;
use crate::schema::function_collaborators::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{
    FunctionCollaborator, FunctionCollaboratorWithUser, NewFunctionCollaborator,
    UpdateFunctionCollaborator,
};

#[derive(Clone)]
pub struct FunctionCollaboratorService {
    pub pool: DbPool,
}

impl FunctionCollaboratorService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_function_collaborator(
        &self,
        function_collaborators_id: Uuid,
    ) -> Result<FunctionCollaborator, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: FunctionCollaborator = dsl::function_collaborators
            .find(function_collaborators_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_function_collaborators(
        &self,
        function_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<FunctionCollaboratorWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select fc.id,
            fc.permission,
            fc.function_id,
            fc.collaborator_id,
            u.firstname,
            u.lastname,
            u.email,
            u.profile_pic,
            fc.created_at,
            fc.updated_at,
            fc.deleted_at
        from function_collaborators fc
              join users u on fc.collaborator_id = u.id
        where fc.function_id = '{}'
        limit {} offset {};",
            function_id.to_string(),
            limit,
            offset
        ))
        .load::<FunctionCollaboratorWithUser>(&mut conn)?;

        Ok(results)
    }

    pub fn create_function_collaborator(
        &self,
        data: NewFunctionCollaborator,
    ) -> Result<FunctionCollaborator, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: FunctionCollaborator = diesel::insert_into(function_collaborators::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new function_collaborators");
        Ok(results)
    }

    pub fn update_function_collaborator(
        &self,
        function_collaborators_id: Uuid,
        data: UpdateFunctionCollaborator,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _function_collaborators_statement =
            diesel::update(dsl::function_collaborators.find(function_collaborators_id))
                .set(&data)
                .get_result::<FunctionCollaborator>(&mut conn)?;

        Ok(())
    }

    pub fn delete_function_collaborator(
        &self,
        function_collaborators_id: Uuid,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::function_collaborators.find(function_collaborators_id))
            .execute(&mut conn)
            .expect("Error deleting function_collaborators");
        Ok(())
    }
}

use crate::extras::types::Error;
use crate::schema::workspace_members::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{NewWorkspaceMember, WorkspaceMember, UpdateWorkspaceMember, WorkspaceMemberWithUser};

#[derive(Clone)]
pub struct WorkspaceMemberService {
    pub pool: DbPool,
}

impl WorkspaceMemberService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_workspace_member(
        &self,
        workspace_members_id: Uuid,
    ) -> Result<WorkspaceMember, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: WorkspaceMember = dsl::workspace_members
            .find(workspace_members_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_workspace_members(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<WorkspaceMemberWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select
            om.id,
            om.user_id,
            om.workspace_id,
            om.role,
            om.user_id,
            u.firstname as firstname,
            u.lastname as lastname,
            u.email as email,
            u.profile_pic as profile_pic,
            om.created_at,
            om.updated_at,
            om.deleted_at
        from workspace_members om
        join users u on om.user_id = u.id
        where om.workspace_id = '{}'
        limit {} offset {};",
            workspace_id.to_string(),
            limit,
            offset
        ))
        .load::<WorkspaceMemberWithUser>(&mut conn)?;

        Ok(results)
    }

    pub fn create_workspace_member(
        &self,
        data: NewWorkspaceMember,
    ) -> Result<WorkspaceMember, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: WorkspaceMember = diesel::insert_into(workspace_members::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new Workspace_members");
        Ok(results)
    }

    pub fn update_workspace_member(
        &self,
        workspace_members_id: Uuid,
        data: UpdateWorkspaceMember,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _workspace_members_statement =
            diesel::update(dsl::workspace_members.find(workspace_members_id))
                .set(&data)
                .get_result::<WorkspaceMember>(&mut conn)?;

        Ok(())
    }

    pub fn delete_workspace_member(&self, workspace_members_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::workspace_members.find(workspace_members_id))
            .execute(&mut conn)
            .expect("Error deleting Workspace_members");
        Ok(())
    }
}

use crate::extras::types::Error;
use crate::modules::workspace_members::model::{WorkspaceMember, NewWorkspaceMember};
use crate::schema::workspaces::{self, dsl};
use crate::schema::workspace_members;
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{NewWorkspace, UpdateWorkspace, Workspace, UserWorkspaces};

#[derive(Clone)]
pub struct WorkspaceService {
    pub pool: DbPool,
}

impl WorkspaceService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_workspace(&self, workspace_id: Uuid) -> Result<Workspace, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: Workspace = dsl::workspaces.find(workspace_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_workspaces(
        &self,
        user_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<UserWorkspaces>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };
        let results = sql_query(format!(
            "select workspaces.* from workspaces
            inner join workspace_members wm on workspaces.id = wm.workspace_id and wm.user_id = '{}'
        limit {} offset {};",
            user_id.to_string(),
            limit,
            offset
        ))
        .load::<UserWorkspaces>(&mut conn)?;

        Ok(results)
    }

    pub fn get_workspaces_by_name(&self, name: String) -> Result<Workspace, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Workspace = dsl::workspaces
            .filter(dsl::name.eq(name))
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn create_workspace(&self, data: NewWorkspace, user_id: Uuid) -> Result<Workspace, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Workspace = diesel::insert_into(workspaces::table)
            .values(&data)
            .get_result(&mut conn)?;

        let wm_data = NewWorkspaceMember {
            user_id,
            workspace_id: results.id,
            role: "OWNER".to_string(),
        };
        
        let _wm_results: WorkspaceMember = diesel::insert_into(workspace_members::table)
            .values(&wm_data)
            .get_result(&mut conn)?;

        Ok(results)
    }

    pub fn update_workspace(&self, workspace_id: Uuid, data: UpdateWorkspace) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _workspace_statement = diesel::update(dsl::workspaces.find(workspace_id))
            .set(&data)
            .get_result::<Workspace>(&mut conn)?;

        Ok(())
    }

    pub fn delete_workspace(&self, workspace_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::workspaces.find(workspace_id))
            .execute(&mut conn)
            .expect("Error deleting Workspace");
        Ok(())
    }
}

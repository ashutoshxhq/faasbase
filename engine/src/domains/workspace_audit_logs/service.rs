use crate::extras::types::Error;
use crate::schema::audit_logs::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*, sql_query};
use uuid::Uuid;

use super::model::{
    NewWorkspaceAuditLog, WorkspaceAuditLog, WorkspaceAuditLogWithUser,
    UpdateWorkspaceAuditLog,
};

#[derive(Clone)]
pub struct AuditLogService {
    pub pool: DbPool,
}

impl AuditLogService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_audit_log(&self, audit_logs_id: Uuid) -> Result<WorkspaceAuditLog, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: WorkspaceAuditLog = dsl::audit_logs.find(audit_logs_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_audit_logs(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<WorkspaceAuditLogWithUser>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results = sql_query(format!(
            "select al.id,
            al.resource_type,
            al.resource_id,
            al.action_type,
            al.actor_id,
            al.workspace_id,
            u.firstname   as firstname,
            u.lastname    as lastname,
            u.email       as email,
            u.profile_pic as profile_pic,
            al.created_at,
            al.updated_at,
            al.deleted_at
        from audit_logs al
              join users u on al.actor_id = u.id
        where al.workspace_id = '{}'
        limit {} offset {};",
            workspace_id.to_string(),
            limit,
            offset
        ))
        .load::<WorkspaceAuditLogWithUser>(&mut conn)?;

        Ok(results)
    }

    pub fn create_audit_log(
        &self,
        data: NewWorkspaceAuditLog,
    ) -> Result<WorkspaceAuditLog, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: WorkspaceAuditLog = diesel::insert_into(audit_logs::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new audit_logs");
        Ok(results)
    }

    pub fn update_audit_log(
        &self,
        audit_logs_id: Uuid,
        data: UpdateWorkspaceAuditLog,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _audit_logs_statement = diesel::update(dsl::audit_logs.find(audit_logs_id))
            .set(&data)
            .get_result::<WorkspaceAuditLog>(&mut conn)?;

        Ok(())
    }

    pub fn delete_audit_log(&self, audit_logs_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::audit_logs.find(audit_logs_id))
            .execute(&mut conn)
            .expect("Error deleting audit_logs");
        Ok(())
    }
}

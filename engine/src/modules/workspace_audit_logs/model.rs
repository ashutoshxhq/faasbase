use crate::schema::audit_logs;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use diesel::sql_types::{Nullable, Timestamp, Uuid as SQLUUID, Varchar};

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = audit_logs)]
pub struct NewWorkspaceAuditLog {
    pub resource_type: String,
    pub resource_id: Uuid,
    pub action_type: String,
    pub actor_id: Uuid,
    pub workspace_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = audit_logs)]
pub struct UpdateWorkspaceAuditLog {
    pub resource_type: String,
    pub resource_id: Uuid,
    pub action_type: String,
    pub actor_id: Uuid,
    pub workspace_id: Uuid,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = audit_logs)]
pub struct WorkspaceAuditLog {
    pub id: Uuid,
    pub resource_type: String,
    pub resource_id: Uuid,
    pub action_type: String,
    pub actor_id: Uuid,
    pub workspace_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}



#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq)]
pub struct WorkspaceAuditLogWithUser {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,
    
    #[diesel(sql_type = Varchar)]
    pub resource_type: String,
    
    #[diesel(sql_type = SQLUUID)]
    pub resource_id: Uuid,

    #[diesel(sql_type = Varchar)]
    pub action_type: String,

    #[diesel(sql_type = SQLUUID)]
    pub actor_id: Uuid,

    #[diesel(sql_type = SQLUUID)]
    pub workspace_id: Uuid,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub firstname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub lastname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub email: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub profile_pic: Option<String>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub created_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub updated_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deleted_at: Option<NaiveDateTime>,
}

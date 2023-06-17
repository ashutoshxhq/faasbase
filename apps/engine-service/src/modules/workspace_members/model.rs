use crate::schema::workspace_members;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use diesel::sql_types::{Nullable, Timestamp, Uuid as SQLUUID, Varchar};

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = workspace_members)]
pub struct NewWorkspaceMember {
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub role: String,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = workspace_members)]
pub struct UpdateWorkspaceMember {
    pub role: String,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = workspace_members)]
pub struct WorkspaceMember {
    pub id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub role: String,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}



#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq)]
pub struct WorkspaceMemberWithUser {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,

    #[diesel(sql_type = SQLUUID)]
    pub user_id: Uuid,

    #[diesel(sql_type = SQLUUID)]
    pub workspace_id: Uuid,

    #[diesel(sql_type = Varchar)]
    pub role: String,

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

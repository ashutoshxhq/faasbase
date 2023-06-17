use crate::schema::workspaces;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::sql_types::{Nullable, Text, Timestamp, Uuid as SQLUUID, Varchar};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = workspaces)]
pub struct NewWorkspace {
    pub name: String,
    pub description: Option<String>,
    pub website: Option<String>,
    pub email: Option<String>,
    pub readme: Option<String>,
    pub twitter: Option<String>,
    pub location: Option<String>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = workspaces)]
pub struct UpdateWorkspace {
    pub name: Option<String>,
    pub description: Option<String>,
    pub website: Option<String>,
    pub email: Option<String>,
    pub readme: Option<String>,
    pub twitter: Option<String>,
    pub location: Option<String>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = workspaces)]
pub struct Workspace {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub website: Option<String>,
    pub email: Option<String>,
    pub readme: Option<String>,
    pub twitter: Option<String>,
    pub location: Option<String>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct UserWorkspaces {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,

    #[diesel(sql_type = Varchar)]
    pub name: String,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub description: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub website: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub email: Option<String>,

    #[diesel(sql_type = Nullable<Text>)]
    pub readme: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub twitter: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub location: Option<String>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub created_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub updated_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deleted_at: Option<NaiveDateTime>,
}

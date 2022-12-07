use crate::schema::workspaces;
use chrono::NaiveDateTime;
use diesel::prelude::*;
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

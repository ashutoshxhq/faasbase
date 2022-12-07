use crate::schema::databases;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = databases)]
pub struct NewDatabase {
    pub name: String,
    pub hostname: String,
    pub username: String,
    pub password: String,
    pub port: String,
    pub database_type: String,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = databases)]
pub struct UpdateDatabase {
    pub name: Option<String>,
    pub hostname: Option<String>,
    pub username: Option<String>,
    pub password: Option<String>,
    pub port: Option<String>,
    pub database_type: Option<String>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = databases)]
pub struct Database {
    pub id: Uuid,
    pub name: String,
    pub hostname: String,
    pub username: String,
    pub password: String,
    pub port: String,
    pub database_type: String,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

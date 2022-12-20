use crate::schema::tables;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = tables)]
pub struct NewDatabaseTable {
    pub name: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub database_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = tables)]
pub struct UpdateDatabaseTable {
    pub database_id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = tables)]
pub struct DatabaseTable {
  pub id: Uuid,
  pub name: String,
  pub description: Option<String>,
  pub readme: Option<String>,
  pub database_id: Uuid,
  pub created_at: Option<NaiveDateTime>,
  pub updated_at: Option<NaiveDateTime>,
  pub deleted_at: Option<NaiveDateTime>,
}


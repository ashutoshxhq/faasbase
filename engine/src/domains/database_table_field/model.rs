use crate::schema::fields;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = fields)]
pub struct NewDatabaseTableField {
    pub data_type: String,
    pub visibility: String,
    pub default_value: Option<String>,
    pub relationship_config: Option<Value>,
    pub table_id: Uuid,
    pub database_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = fields)]
pub struct UpdateDatabaseTableField {
    pub data_type: String,
    pub visibility: String,
    pub default_value: Option<String>,
    pub relationship_config: Option<Value>,
    pub table_id: Uuid,
    pub database_id: Uuid,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = fields)]
pub struct DatabaseTableField {
  pub id: Uuid,
  pub data_type: String,
  pub visibility: String,
  pub default_value: Option<String>,
  pub relationship_config: Option<Value>,
  pub table_id: Uuid,
  pub database_id: Uuid,
  pub created_at: Option<NaiveDateTime>,
  pub updated_at: Option<NaiveDateTime>,
  pub deleted_at: Option<NaiveDateTime>,
}


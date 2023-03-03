use crate::schema::application_logs;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = application_logs)]
pub struct NewApplicationLog {
    pub log_type: String,
    pub application_id: Uuid,
    pub resource_type: String,
    pub resource_id: Uuid,
    pub data: Value,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = application_logs)]
pub struct UpdateApplicationLog {
    pub log_type: String,
    pub application_id: Uuid,
    pub resource_type: String,
    pub resource_id: Uuid,
    pub data: Value,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = application_logs)]
pub struct ApplicationLog {
    pub id: Uuid,
    pub log_type: String,
    pub application_id: Uuid,
    pub resource_type: String,
    pub resource_id: Uuid,
    pub data: Value,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

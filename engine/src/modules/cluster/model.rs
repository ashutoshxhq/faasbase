use crate::schema::clusters;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = clusters)]
pub struct NewCluster {
    pub name: String,
    pub provider: String,
    pub provider_config: Value,
    pub cluster_config: String,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = clusters)]
pub struct UpdateCluster {
    pub name: String,
    pub provider: String,
    pub provider_config: Value,
    pub cluster_config: String,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = clusters)]
pub struct Cluster {
    pub id: Uuid,
    pub name: String,
    pub provider: String,
    pub provider_config: Value,
    pub cluster_config: String,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

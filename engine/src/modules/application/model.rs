use crate::schema::applications;
use crate::schema::application_forks;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = applications)]
pub struct NewApplication {
    pub name: String,
    pub application_type: String,
    pub visibility: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub size: Option<String>,
    pub config: Option<Value>,
    pub deployed_version: Option<String>,
    pub variables: Option<Value>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = applications)]
pub struct UpdateApplication {
    pub name: Option<String>,
    pub application_type: Option<String>,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub visibility: Option<String>,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub size: Option<String>,
    pub config: Option<Value>,
    pub deployed_version: Option<String>,
    pub variables: Option<Value>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ForkApplication {
    pub name: String,
    pub application_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
}

#[derive(Debug,Insertable, Serialize, Deserialize)]
#[diesel(table_name = application_forks)]
pub struct CreateApplicationFork {
    pub source_application_id: Uuid,
    pub target_application_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
}

#[derive(Debug,Queryable, Serialize, Deserialize)]
#[diesel(table_name = application_forks)]
pub struct ApplicationFork {
    pub id: Uuid,
    pub source_application_id: Uuid,
    pub target_application_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = applications)]
pub struct Application {
    pub id: Uuid,
    pub name: String,
    pub application_type: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub visibility: String,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub deployed_version: Option<String>,
    pub size: Option<String>,
    pub config: Option<Value>,
    pub variables: Option<Value>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

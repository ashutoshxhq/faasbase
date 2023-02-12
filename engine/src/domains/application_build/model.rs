use crate::{
    domains::{
        application_resource::model::ApplicationResourceWithFunction, cluster::model::Cluster,
    },
    schema::application_builds,
};
use chrono::NaiveDateTime;
use diesel::sql_types::{Nullable, Timestamp, Uuid as SQLUUID, Varchar};
use diesel::{prelude::*, sql_types::Jsonb};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = application_builds)]
pub struct NewApplicationBuild {
    pub version: String,
    pub changelog: Option<String>,
    pub config: Option<Value>,
    pub application_id: Option<Uuid>,
    pub user_id: Option<Uuid>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = application_builds)]
pub struct UpdateApplicationBuild {
    pub version: String,
    pub changelog: Option<String>,
    pub config: Option<Value>,
    pub deleted_at: Option<NaiveDateTime>,
    pub build_status: Option<String>,
    pub deployment_status: Option<String>,
    pub logs: Option<Value>,
    pub built_at: Option<NaiveDateTime>,
    pub deployed_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = application_builds)]
pub struct ApplicationBuild {
    pub id: Uuid,
    pub version: String,
    pub changelog: Option<String>,
    pub config: Option<Value>,
    pub application_id: Uuid,
    pub user_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
    pub build_status: Option<String>,
    pub deployment_status: Option<String>,
    pub logs: Option<Value>,
    pub built_at: Option<NaiveDateTime>,
    pub deployed_at: Option<NaiveDateTime>,
}

#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq)]
pub struct ApplicationBuildWithUser {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,

    #[diesel(sql_type = Varchar)]
    pub version: String,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub changelog: Option<String>,

    #[diesel(sql_type = Nullable<Jsonb>)]
    pub config: Option<Value>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub firstname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub lastname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub email: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub profile_pic: Option<String>,

    #[diesel(sql_type = SQLUUID)]
    pub application_id: Uuid,

    #[diesel(sql_type = Nullable<SQLUUID>)]
    pub user_id: Option<Uuid>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub created_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub updated_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deleted_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub build_status: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub deployment_status: Option<String>,

    #[diesel(sql_type = Nullable<Jsonb>)]
    pub logs: Option<Value>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub built_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deployed_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationBuildContext {
    pub id: Uuid,
    pub name: String,
    pub application_type: String,
    pub build_version: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub visibility: String,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub deployed_version: Option<String>,
    pub size: Option<String>,
    pub config: Option<ApplicationConfig>,
    pub variables: Option<Value>,
    pub resources: Vec<ApplicationResourceWithFunction>,
    pub cluster: Option<Cluster>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationConfig {
    pub deployment_target: Option<String>,
    pub jwks_uri: Option<String>,
    pub jwt_algorithm: Option<String>,
    pub jwt_auth_enabled: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClusterProviderConfig {
    pub aws_access_key_id: Option<String>,
    pub aws_secret_access_key: Option<String>,
    pub region: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationResourceConfig {
    pub endpoint: Option<String>,
    pub method: Option<String>,
    pub version: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationVariables {
    pub config_vars: Option<Vec<Variable>>,
    pub secrets: Option<Vec<Variable>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Variable {
    pub id: String,
    pub key: String,
    pub value: String,
}

use crate::schema::application_builds;
use chrono::NaiveDateTime;
use diesel::{prelude::*, sql_types::Jsonb};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;
use diesel::sql_types::{Nullable, Timestamp, Uuid as SQLUUID, Varchar};

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
}

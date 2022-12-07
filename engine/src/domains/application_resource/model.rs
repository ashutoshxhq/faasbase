use crate::domains::function::model::Function;
use crate::schema::application_resources;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use diesel::sql_types::{Jsonb, Nullable, Timestamp, Uuid as SQLUUID, Varchar};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = application_resources)]
pub struct NewApplicationResource {
    pub resource_type: String,
    pub config: Option<Value>,
    pub resource_id: Option<Uuid>,
    pub application_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = application_resources)]
pub struct UpdateApplicationResource {
    pub resource_type: String,
    pub config: Option<Value>,
    pub resource_id: Option<Uuid>,
    pub application_id: Uuid,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = application_resources)]
pub struct ApplicationResource {
    pub id: Uuid,
    pub resource_type: String,
    pub config: Option<Value>,
    pub resource_id: Option<Uuid>,
    pub application_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationResourceWithFunctionData {
    pub id: Uuid,
    pub resource_type: String,
    pub config: Option<Value>,
    pub resource_id: Option<Uuid>,
    pub application_id: Uuid,
    pub function: Function,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}


#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct ApplicationResourceWithFunction {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,
    
    #[diesel(sql_type = Varchar)]
    pub resource_type: String,
    
    #[diesel(sql_type = Varchar)]
    pub resource_name: String,

    #[diesel(sql_type = Nullable<Jsonb>)]
    pub config: Option<Value>,

    #[diesel(sql_type = Nullable<SQLUUID>)]
    pub resource_id: Option<Uuid>,

    #[diesel(sql_type = SQLUUID)]
    pub application_id: Uuid,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub created_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub updated_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deleted_at: Option<NaiveDateTime>,
}

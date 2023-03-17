use crate::{schema::functions, schema::function_forks, schema::function_stars, modules::function_build::model::FunctionBuild};
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = functions)]
pub struct NewFunction {
    pub name: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub repository: Option<String>,
    pub visibility: String,
    pub website: Option<String>,
    pub size: Option<String>,
    pub latest_version: Option<String>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = functions)]
pub struct UpdateFunction {
    pub name: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub visibility: Option<String>,
    pub size: Option<String>,
    pub latest_version: Option<String>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = functions)]
pub struct Function {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub repository: Option<String>,
    pub visibility: String,
    pub website: Option<String>,
    pub size: Option<String>,
    pub latest_version: Option<String>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct FunctionWithBuilds {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub repository: Option<String>,
    pub visibility: String,
    pub website: Option<String>,
    pub size: Option<String>,
    pub latest_version: Option<String>,
    pub builds: Vec<FunctionBuild>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct ForkFunction {
    pub name: String,
    pub function_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
}

#[derive(Debug,Insertable, Serialize, Deserialize)]
#[diesel(table_name = function_forks)]
pub struct CreateFunctionFork {
    pub source_function_id: Uuid,
    pub target_function_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
}


#[derive(Debug,Insertable, Serialize, Deserialize)]
#[diesel(table_name = function_stars)]
pub struct CreateFunctionStar {
    pub function_id: Uuid,
    pub user_id: Uuid,
}


#[derive(Debug,Queryable, Serialize, Deserialize)]
#[diesel(table_name = function_stars)]
pub struct FunctionStar {
    pub id: Uuid,
    pub function_id: Uuid,
    pub user_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}
#[derive(Debug,Queryable, Serialize, Deserialize)]
#[diesel(table_name = function_forks)]
pub struct FunctionFork {
    pub id: Uuid,
    pub source_function_id: Uuid,
    pub target_function_id: Uuid,
    pub user_id: Uuid,
    pub workspace_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}
use crate::schema::users;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use uuid::Uuid;

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub username: Option<String>,
    pub connection: Option<String>,
    pub idp_user_id: String,
    pub profile_pic: Option<String>,
    pub readme: Option<String>,
    pub timezone: Option<String>,
    pub metadata: Option<Value>,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = users)]
pub struct UpdateUser {
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub username: Option<String>,
    pub connection: Option<String>,
    pub idp_user_id: Option<String>,
    pub profile_pic: Option<String>,
    pub readme: Option<String>,
    pub timezone: Option<String>,
    pub metadata: Option<Value>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = users)]
pub struct User {
    pub id: Uuid,
    pub firstname: Option<String>,
    pub lastname: Option<String>,
    pub email: Option<String>,
    pub username: Option<String>,
    pub connection: Option<String>,
    pub idp_user_id: String,
    pub profile_pic: Option<String>,
    pub readme: Option<String>,
    pub timezone: Option<String>,
    pub metadata: Option<Value>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

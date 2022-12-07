use crate::schema::application_collaborators;
use chrono::NaiveDateTime;
use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use diesel::sql_types::{Nullable, Timestamp, Uuid as SQLUUID, Varchar};

#[derive(Debug, Insertable, Serialize, Deserialize)]
#[diesel(table_name = application_collaborators)]
pub struct NewApplicationCollaborator {
    pub permission: String,
    pub application_id: Uuid,
    pub collaborator_id: Uuid,
}

#[derive(Debug, AsChangeset, Serialize, Deserialize)]
#[diesel(table_name = application_collaborators)]
pub struct UpdateApplicationCollaborator {
    pub permission: String,
    pub application_id: Uuid,
    pub collaborator_id: Uuid,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Queryable, Insertable, Serialize, Deserialize, Clone)]
#[diesel(table_name = application_collaborators)]
pub struct ApplicationCollaborator {
    pub id: Uuid,
    pub permission: String,
    pub application_id: Uuid,
    pub collaborator_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}


#[derive(QueryableByName, Debug, Serialize, Deserialize, PartialEq)]
pub struct ApplicationCollaboratorWithUser {
    #[diesel(sql_type = SQLUUID)]
    pub id: Uuid,

    #[diesel(sql_type = Varchar)]
    pub permission: String,

    #[diesel(sql_type = SQLUUID)]
    pub application_id: Uuid,

    #[diesel(sql_type = SQLUUID)]
    pub collaborator_id: Uuid,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub firstname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub lastname: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub email: Option<String>,

    #[diesel(sql_type = Nullable<Varchar>)]
    pub profile_pic: Option<String>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub created_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub updated_at: Option<NaiveDateTime>,

    #[diesel(sql_type = Nullable<Timestamp>)]
    pub deleted_at: Option<NaiveDateTime>,
}

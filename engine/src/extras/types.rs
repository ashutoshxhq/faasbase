use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Deserialize)]
pub struct Pagination {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Deserialize)]
pub struct GetUsersByQuery {
    pub query: String,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Deserialize)]
pub struct GetWorkspaceResourceQuery {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
    pub workspace_id: Uuid,
    pub name: Option<String>,
}
#[derive(Deserialize)]
pub struct SearchApplicationQuery {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
    pub query: String,
}
#[derive(Deserialize)]
pub struct SearchWorkspaceResourceQuery {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
    pub query: String,
}

#[derive(Deserialize)]
pub struct GetApplicationResourceQuery {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
    pub application_id: Uuid,
}

#[derive(Deserialize)]
pub struct GetFunctionResourceQuery {
    pub offset: Option<i64>,
    pub limit: Option<i64>,
    pub function_id: Uuid,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterWebhookRequest {
    pub idp_user_id: String,
    pub email: String,
    pub username: String,
    pub firstname: Option<String>,
    pub lastname:  Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApplicationResourceConfig {
    pub endpoint: String,
    pub method: String,
    pub version: String,
}

pub type Error = Box<dyn std::error::Error + Send + Sync + 'static>;

use std::error;
use std::fmt;
#[derive(Debug)]
pub struct FaasbaseError {
    error_message: String,
    error_code: String,
    status_code: u32,
}

impl FaasbaseError {
    pub fn new(error_code: String, error_message: String, status_code: u32) -> Box<Self> {
        Box::new(Self {
            error_code,
            error_message,
            status_code,
        })
    }
}

impl fmt::Display for FaasbaseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "({} ({}): {})",
            self.error_code, self.status_code, self.error_message
        )
    }
}

impl error::Error for FaasbaseError {}
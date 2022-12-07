use serde::{Serialize, Deserialize};

pub mod types;

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenResponse {
    pub token_type: String,
    pub scope: String,
    pub access_token: String,
    pub expires_in: u64,
}

use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkerPingPayload {
    pub hostname: String,
    pub status: String,
}
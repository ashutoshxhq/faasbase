use axum::{Extension, Json, response::IntoResponse};
use hyper::StatusCode;
use serde_json::json;
use crate::state::FaasbaseState;
use super::model::WorkerPingPayload;

pub async fn worker_ping(
    Extension(_faasbase): Extension<FaasbaseState>,
    Json(data): Json<WorkerPingPayload>,
) -> impl IntoResponse {

    // let mut db = PickleDb::load("workers.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json).unwrap();
    // db.set(&data.hostname, &data.status).unwrap();


    tracing::info!("worker ping received: {:?}", data);
    (
        StatusCode::OK,
        Json(json!({
            "status": "ok",
            "data": "worker ping received",
        })),
    )
}
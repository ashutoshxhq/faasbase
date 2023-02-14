use axum::{Extension, Json, response::IntoResponse};
use hyper::StatusCode;
use serde_json::json;
use crate::state::FaaslyState;
use super::model::WorkerPingPayload;

pub async fn worker_ping(
    Extension(_faasly): Extension<FaaslyState>,
    Json(data): Json<WorkerPingPayload>,
) -> impl IntoResponse {

    tracing::info!("worker ping received: {:?}", data);
    (
        StatusCode::OK,
        Json(json!({
            "status": "ok",
            "data": "worker ping received",
        })),
    )
}
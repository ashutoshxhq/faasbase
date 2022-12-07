use axum::{response::IntoResponse, Extension, Json};
use hyper::StatusCode;
use serde_json::json;

use crate::{state::FaaslyState, extras::types::RegisterWebhookRequest};

pub async fn register_webhook(
    Extension(faasly): Extension<FaaslyState>,
    Json(data): Json<RegisterWebhookRequest>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .authn
        .register_webhook(data)
        .await;
    match res {
        Ok(res) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "data": res
            })),
        ),
        Err(err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": err.to_string()
            })),
        ),
    }
}

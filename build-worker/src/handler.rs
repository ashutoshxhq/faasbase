use axum::{http::Request, response::IntoResponse, Extension, Json};
use hyper::{Body, StatusCode};
use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};
use serde_json::json;

use crate::{authz::TokenClaims, builder::ApplicationBuilder, types::ApplicationBuildContext};

pub async fn health() -> impl IntoResponse {

    let hostname = std::env::var("HOSTNAME").unwrap_or_else(|_| "unknown".to_string());
    (
        StatusCode::OK,
        Json(json!({
            "status": "ok",
            "hostname": hostname,
        })),
    )
}

pub async fn build_application(
    Extension(_claims): Extension<TokenClaims>,
    req: Request<Body>,
) -> impl IntoResponse {

    let mut db = PickleDb::load("status.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json).unwrap();
    db.set("status", &String::from("BUSY")).unwrap();

    let headers = req.headers().clone();

    let body = req.into_body();
    let body = hyper::body::to_bytes(body).await.unwrap();
    let body = body.to_vec();
    let application_build_context: ApplicationBuildContext = serde_json::from_slice(&body).unwrap();

    let auth_header = headers
        .get("Authorization")
        .and_then(|header| header.to_str().ok());

    if let Some(auth_header) = auth_header {
        let auth_token = auth_header.split(" ").last();
        let auth_token = auth_token.unwrap();
        let application_builder = ApplicationBuilder::new(application_build_context, auth_token.to_string());
        let _application_build = application_builder.build().await;

        db.set("status", &String::from("FREE")).unwrap();

        return (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
            })),
        );
    } else {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({
                "error": "UNAUTHORIZED",
                "status": "error",
                "message": "Unauthorized: please provide a valid auth token",
            })),
        );
    }
}

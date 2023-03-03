use std::str::FromStr;

use axum::{
    http::Request,
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use hyper::Body;
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, extras::types::Pagination, state::FaasbaseState};

use super::model::{NewApplicationBuild, UpdateApplicationBuild};

pub async fn get_application_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_build_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_build_id = Uuid::from_str(&application_build_id);
    match application_build_id {
        Ok(application_build_id) => {
            let res = faasbase
                .services
                .application_build
                .get_application_build(application_build_id);
            match res {
                Ok(res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": res,
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
        Err(_err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": "bad application_build id in url",
            })),
        ),
    }
}

pub async fn get_application_builds(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(application_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasbase.services.application_build.get_application_builds(
                application_id,
                query.offset,
                query.limit,
            );
            match res {
                Ok(res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": res,
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
        Err(_err) => {
            println!("{:?}", _err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "error": "bad application_resource id in url",
                })),
            )
        }
    }
}

pub async fn create_application_build(
    Extension(faasbase): Extension<FaasbaseState>,
    req: Request<Body>,
) -> impl IntoResponse {
    let headers = req.headers().clone();

    let body = hyper::body::to_bytes(req.into_body()).await.unwrap();
    let body = body.to_vec();
    let payload: NewApplicationBuild = serde_json::from_slice(&body).unwrap();

    let auth_header = headers
        .get("Authorization")
        .and_then(|header| header.to_str().ok());

    let res = faasbase
        .services
        .application_build
        .create_application_build(payload, auth_header.unwrap().to_string()).await;
    match res {
        Ok(res) => (
            StatusCode::OK,
            Json(json!({
                "status": "ok",
                "data": res,
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

pub async fn update_application_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_build_id)): Path<(String, String)>,
    Json(data): Json<UpdateApplicationBuild>,
) -> impl IntoResponse {
    let application_build_id = Uuid::from_str(&application_build_id);
    match application_build_id {
        Ok(application_build_id) => {
            let res = faasbase
                .services
                .application_build
                .update_application_build(application_build_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_build updated successfully",
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
        Err(_err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": "bad application_build id in url",
            })),
        ),
    }
}

pub async fn delete_application_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_build_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_build_id = Uuid::from_str(&application_build_id);
    match application_build_id {
        Ok(application_build_id) => {
            let res = faasbase
                .services
                .application_build
                .delete_application_build(application_build_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_build deleted successfully",
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
        Err(_err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": "bad application_build id in url",
            })),
        ),
    }
}

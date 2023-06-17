use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, extras::types::Pagination, state::FaasbaseState};

use super::model::{NewApplicationResource, UpdateApplicationResource};

pub async fn get_application_resource(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_resource_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_resource_id = Uuid::from_str(&application_resource_id);
    match application_resource_id {
        Ok(application_resource_id) => {
            let res = faasbase
                .services
                .application_resource
                .get_application_resource(application_resource_id);
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
                "error": "bad application_resource id in url",
            })),
        ),
    }
}

pub async fn get_application_resources(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(application_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasbase
                .services
                .application_resource
                .get_application_resources(application_id, query.offset, query.limit);
            match res {
                Ok(res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": res,
                    })),
                ),
                Err(err) => {
                    println!("{:?}", err);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!({
                            "status": "error",
                            "error": err.to_string()
                        })),
                    )
                }
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

pub async fn create_application_resource(
    Extension(faasbase): Extension<FaasbaseState>,
    Json(payload): Json<NewApplicationResource>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .application_resource
        .create_application_resource(payload);
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

pub async fn update_application_resource(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_resource_id)): Path<(String, String)>,
    Json(data): Json<UpdateApplicationResource>,
) -> impl IntoResponse {
    let application_resource_id = Uuid::from_str(&application_resource_id);
    match application_resource_id {
        Ok(application_resource_id) => {
            let res = faasbase
                .services
                .application_resource
                .update_application_resource(application_resource_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_resource updated successfully",
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
                "error": "bad application_resource id in url",
            })),
        ),
    }
}

pub async fn delete_application_resource(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_resource_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_resource_id = Uuid::from_str(&application_resource_id);
    match application_resource_id {
        Ok(application_resource_id) => {
            let res = faasbase
                .services
                .application_resource
                .delete_application_resource(application_resource_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_resource deleted successfully",
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
                "error": "bad application_resource id in url",
            })),
        ),
    }
}

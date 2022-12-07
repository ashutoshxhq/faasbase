use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, extras::types::Pagination, state::FaaslyState};

use super::model::{NewFunctionCollaborator, UpdateFunctionCollaborator};

pub async fn get_function_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_function_id, function_collaborator_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let function_collaborator_id = Uuid::from_str(&function_collaborator_id);
    match function_collaborator_id {
        Ok(function_collaborator_id) => {
            let res = faasly
                .services
                .function_collaborator
                .get_function_collaborator(function_collaborator_id);
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
                "error": "bad function_collaborator id in url",
            })),
        ),
    }
}

pub async fn get_function_collaborators(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(function_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let function_id = Uuid::from_str(&function_id);
    match function_id {
        Ok(function_id) => {
            let res = faasly
                .services
                .function_collaborator
                .get_function_collaborators(function_id, query.offset, query.limit);
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
                "error": "bad function id in url",
            })),
        ),
    }
}

pub async fn create_function_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewFunctionCollaborator>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .function_collaborator
        .create_function_collaborator(payload);
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

pub async fn update_function_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_function_id, function_collaborator_id)): Path<(String, String)>,
    Json(data): Json<UpdateFunctionCollaborator>,
) -> impl IntoResponse {
    let function_collaborator_id = Uuid::from_str(&function_collaborator_id);
    match function_collaborator_id {
        Ok(function_collaborator_id) => {
            let res = faasly
                .services
                .function_collaborator
                .update_function_collaborator(function_collaborator_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function_collaborator updated successfully",
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
                "error": "bad function_collaborator id in url",
            })),
        ),
    }
}

pub async fn delete_function_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_function_id, function_collaborator_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let function_collaborator_id = Uuid::from_str(&function_collaborator_id);
    match function_collaborator_id {
        Ok(function_collaborator_id) => {
            let res = faasly
                .services
                .function_collaborator
                .delete_function_collaborator(function_collaborator_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function_collaborator deleted successfully",
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
                "error": "bad function_collaborator id in url",
            })),
        ),
    }
}

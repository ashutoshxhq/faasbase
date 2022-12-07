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

use super::model::{NewApplicationCollaborator, UpdateApplicationCollaborator};

pub async fn get_application_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_application_id, application_collaborator_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_collaborator_id = Uuid::from_str(&application_collaborator_id);
    match application_collaborator_id {
        Ok(application_collaborator_id) => {
            let res = faasly
                .services
                .application_collaborator
                .get_application_collaborator(application_collaborator_id);
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
                "error": "bad application_collaborator id in url",
            })),
        ),
    }
}

pub async fn get_application_collaborators(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(application_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasly
                .services
                .application_collaborator
                .get_application_collaborators(application_id, query.offset, query.limit);
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

pub async fn create_application_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewApplicationCollaborator>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .application_collaborator
        .create_application_collaborator(payload);
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

pub async fn update_application_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_application_id, application_collaborator_id)): Path<(String, String)>,
    Json(data): Json<UpdateApplicationCollaborator>,
) -> impl IntoResponse {
    let application_collaborator_id = Uuid::from_str(&application_collaborator_id);
    match application_collaborator_id {
        Ok(application_collaborator_id) => {
            let res = faasly
                .services
                .application_collaborator
                .update_application_collaborator(application_collaborator_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_collaborator updated successfully",
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
                "error": "bad application_collaborator id in url",
            })),
        ),
    }
}

pub async fn delete_application_collaborator(
    Extension(faasly): Extension<FaaslyState>,
    Path((_application_id, application_collaborator_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_collaborator_id = Uuid::from_str(&application_collaborator_id);
    match application_collaborator_id {
        Ok(application_collaborator_id) => {
            let res = faasly
                .services
                .application_collaborator
                .delete_application_collaborator(application_collaborator_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_collaborator deleted successfully",
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
                "error": "bad application_collaborator id in url",
            })),
        ),
    }
}

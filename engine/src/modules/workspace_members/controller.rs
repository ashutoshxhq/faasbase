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

use super::model::{NewWorkspaceMember, UpdateWorkspaceMember};

pub async fn get_workspace_member(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_workspace_id, workspace_member_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let workspace_member_id = Uuid::from_str(&workspace_member_id);
    match workspace_member_id {
        Ok(workspace_member_id) => {
            let res = faasbase
                .services
                .workspace_member
                .get_workspace_member(workspace_member_id);
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
                "error": "bad workspace_member id in url",
            })),
        ),
    }
}

pub async fn get_workspace_members(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(workspace_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let workspace_id = Uuid::from_str(&workspace_id);
    match workspace_id {
        Ok(workspace_id) => {
            let res = faasbase
                .services
                .workspace_member
                .get_workspace_members(workspace_id, query.offset, query.limit);
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
                "error": "bad workspace id in url",
            })),
        ),
    }
}

pub async fn create_workspace_member(
    Extension(faasbase): Extension<FaasbaseState>,
    Json(payload): Json<NewWorkspaceMember>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .workspace_member
        .create_workspace_member(payload);
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

pub async fn update_workspace_member(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_workspace_id, workspace_member_id)): Path<(String, String)>,
    Json(data): Json<UpdateWorkspaceMember>,
) -> impl IntoResponse {
    let workspace_member_id = Uuid::from_str(&workspace_member_id);
    match workspace_member_id {
        Ok(workspace_member_id) => {
            let res = faasbase
                .services
                .workspace_member
                .update_workspace_member(workspace_member_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "workspace_member updated successfully",
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
                "error": "bad workspace_member id in url",
            })),
        ),
    }
}

pub async fn delete_workspace_member(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_workspace_id, workspace_member_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let workspace_member_id = Uuid::from_str(&workspace_member_id);
    match workspace_member_id {
        Ok(workspace_member_id) => {
            let res = faasbase
                .services
                .workspace_member
                .delete_workspace_member(workspace_member_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "workspace_member deleted successfully",
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
                "error": "bad workspace_member id in url",
            })),
        ),
    }
}

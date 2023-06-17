use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, state::FaasbaseState};

use super::model::{NewWorkspace, UpdateWorkspace};

pub async fn get_workspace(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(workspace_id): Path<String>,
) -> impl IntoResponse {
    let workspace_id = Uuid::from_str(&workspace_id);
    match workspace_id {
        Ok(workspace_id) => {
            let res = faasbase.services.workspace.get_workspace(workspace_id);
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

#[derive(Deserialize)]
pub struct GetWorkspacesQuery {
    pub name: Option<String>,
    pub offset: Option<i64>,
    pub limit: Option<i64>,
}

pub async fn get_workspaces(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(claims): Extension<TokenClaims>,
    query: Query<GetWorkspacesQuery>,
) -> impl IntoResponse {
    if let Some(name) = query.name.clone() {
        let res = faasbase
            .services
            .workspace
            .get_workspaces_by_name(name);
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
    } else {
        let res = faasbase
            .services
            .workspace
            .get_workspaces(claims.user_id, query.offset, query.limit);
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
}

pub async fn create_workspace(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(claims): Extension<TokenClaims>,
    Json(payload): Json<NewWorkspace>,
) -> impl IntoResponse {
    let res = faasbase.services.workspace.create_workspace(payload, claims.user_id);
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

pub async fn update_workspace(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(workspace_id): Path<String>,
    Json(data): Json<UpdateWorkspace>,
) -> impl IntoResponse {
    let workspace_id = Uuid::from_str(&workspace_id);
    match workspace_id {
        Ok(workspace_id) => {
            let res = faasbase
                .services
                .workspace
                .update_workspace(workspace_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "workspace updated successfully",
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

pub async fn delete_workspace(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(workspace_id): Path<String>,
) -> impl IntoResponse {
    let workspace_id = Uuid::from_str(&workspace_id);
    match workspace_id {
        Ok(workspace_id) => {
            let res = faasbase.services.workspace.delete_workspace(workspace_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "workspace deleted successfully",
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

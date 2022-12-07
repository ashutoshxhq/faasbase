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

use super::model::{NewWorkspaceAuditLog, UpdateWorkspaceAuditLog};

pub async fn get_audit_log(
    Extension(faasly): Extension<FaaslyState>,
    Path((_workspace_id, workspace_audit_log_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let workspace_audit_log_id = Uuid::from_str(&workspace_audit_log_id);
    match workspace_audit_log_id {
        Ok(workspace_audit_log_id) => {
            let res = faasly
                .services
                .audit_log
                .get_audit_log(workspace_audit_log_id);
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
                "error": "bad audit_log id in url",
            })),
        ),
    }
}

pub async fn get_audit_logs(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(workspace_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let workspace_id = Uuid::from_str(&workspace_id);
    match workspace_id {
        Ok(workspace_id) => {
            let res = faasly.services.audit_log.get_audit_logs(
                workspace_id,
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
        Err(_err) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!({
                "status": "error",
                "error": "bad workspace id in url",
            })),
        ),
    }
}

pub async fn create_audit_log(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewWorkspaceAuditLog>,
) -> impl IntoResponse {
    let res = faasly.services.audit_log.create_audit_log(payload);
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

pub async fn update_audit_log(
    Extension(faasly): Extension<FaaslyState>,
    Path((_workspace_id, workspace_audit_log_id)): Path<(String, String)>,
    Json(data): Json<UpdateWorkspaceAuditLog>,
) -> impl IntoResponse {
    let workspace_audit_log_id = Uuid::from_str(&workspace_audit_log_id);
    match workspace_audit_log_id {
        Ok(workspace_audit_log_id) => {
            let res = faasly
                .services
                .audit_log
                .update_audit_log(workspace_audit_log_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "audit_log updated successfully",
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
                "error": "bad audit_log id in url",
            })),
        ),
    }
}

pub async fn delete_audit_log(
    Extension(faasly): Extension<FaaslyState>,
    Path((_workspace_id, workspace_audit_log_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let workspace_audit_log_id = Uuid::from_str(&workspace_audit_log_id);
    match workspace_audit_log_id {
        Ok(workspace_audit_log_id) => {
            let res = faasly
                .services
                .audit_log
                .delete_audit_log(workspace_audit_log_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "audit_log deleted successfully",
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
                "error": "bad audit_log id in url",
            })),
        ),
    }
}

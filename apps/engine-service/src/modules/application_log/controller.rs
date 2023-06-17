use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, extras::types::GetApplicationResourceQuery, state::FaasbaseState};

use super::model::{NewApplicationLog, UpdateApplicationLog};

pub async fn get_application_log(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_log_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_log_id = Uuid::from_str(&application_log_id);
    match application_log_id {
        Ok(application_log_id) => {
            let res = faasbase
                .services
                .application_log
                .get_application_log(application_log_id);
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
                "error": "bad application_log id in url",
            })),
        ),
    }
}

pub async fn get_application_logs(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<GetApplicationResourceQuery>,
) -> impl IntoResponse {
    let res = faasbase.services.application_log.get_application_logs(
        query.application_id,
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

pub async fn create_application_log(
    Extension(faasbase): Extension<FaasbaseState>,
    Json(payload): Json<NewApplicationLog>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .application_log
        .create_application_log(payload);
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

pub async fn update_application_log(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_log_id)): Path<(String, String)>,
    Json(data): Json<UpdateApplicationLog>,
) -> impl IntoResponse {
    let application_log_id = Uuid::from_str(&application_log_id);
    match application_log_id {
        Ok(application_log_id) => {
            let res = faasbase
                .services
                .application_log
                .update_application_log(application_log_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_log updated successfully",
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
                "error": "bad application_log id in url",
            })),
        ),
    }
}

pub async fn delete_application_log(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_application_id, application_log_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let application_log_id = Uuid::from_str(&application_log_id);
    match application_log_id {
        Ok(application_log_id) => {
            let res = faasbase
                .services
                .application_log
                .delete_application_log(application_log_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application_log deleted successfully",
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
                "error": "bad application_log id in url",
            })),
        ),
    }
}

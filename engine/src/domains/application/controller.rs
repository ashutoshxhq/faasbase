use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{
    authz::TokenClaims, extras::types::{GetWorkspaceResourceQuery, SearchApplicationQuery}, state::FaasbaseState,
};

use super::model::{NewApplication, UpdateApplication};

pub async fn get_application(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(application_id): Path<String>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasbase
                .services
                .application
                .get_application(application_id);
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
                "error": "bad application id in url",
            })),
        ),
    }
}

pub async fn get_applications(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<GetWorkspaceResourceQuery>,
) -> impl IntoResponse {
    let res = faasbase.services.application.get_applications(
        query.workspace_id,
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


pub async fn search_applications(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<SearchApplicationQuery>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .application
        .search_applications(query.query.clone(), query.offset.clone(), query.limit.clone());
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

pub async fn create_application(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Json(payload): Json<NewApplication>,
) -> impl IntoResponse {
    let res = faasbase.services.application.create_application(payload, _claims.user_id);
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

pub async fn update_application(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(application_id): Path<String>,
    Json(data): Json<UpdateApplication>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasbase
                .services
                .application
                .update_application(application_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application updated successfully",
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
                "error": "bad application id in url",
            })),
        ),
    }
}

pub async fn delete_application(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(application_id): Path<String>,
) -> impl IntoResponse {
    let application_id = Uuid::from_str(&application_id);
    match application_id {
        Ok(application_id) => {
            let res = faasbase
                .services
                .application
                .delete_application(application_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "application deleted successfully",
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
                "error": "bad application id in url",
            })),
        ),
    }
}

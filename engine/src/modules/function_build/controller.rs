use std::str::FromStr;

use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

use crate::{authz::TokenClaims, extras::types::{Pagination}, state::FaasbaseState};

use super::model::{NewFunctionBuild, UpdateFunctionBuild};

pub async fn get_function_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_function_id, function_build_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let function_build_id = Uuid::from_str(&function_build_id);
    match function_build_id {
        Ok(function_build_id) => {
            let res = faasbase
                .services
                .function_build
                .get_function_build(function_build_id);
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
                "error": "bad function_build id in url",
            })),
        ),
    }
}

pub async fn get_function_builds(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(function_id): Path<Uuid>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let res = faasbase.services.function_build.get_function_builds(
        function_id,
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

pub async fn create_function_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Json(payload): Json<NewFunctionBuild>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .function_build
        .create_function_build(payload);
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

pub async fn update_function_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_function_id, function_build_id)): Path<(String, String)>,
    Json(data): Json<UpdateFunctionBuild>,
) -> impl IntoResponse {
    let function_build_id = Uuid::from_str(&function_build_id);
    match function_build_id {
        Ok(function_build_id) => {
            let res = faasbase
                .services
                .function_build
                .update_function_build(function_build_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function_build updated successfully",
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
                "error": "bad function_build id in url",
            })),
        ),
    }
}

pub async fn delete_function_build(
    Extension(faasbase): Extension<FaasbaseState>,
    Path((_function_id, function_build_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let function_build_id = Uuid::from_str(&function_build_id);
    match function_build_id {
        Ok(function_build_id) => {
            let res = faasbase
                .services
                .function_build
                .delete_function_build(function_build_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function_build deleted successfully",
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
                "error": "bad function_build id in url",
            })),
        ),
    }
}

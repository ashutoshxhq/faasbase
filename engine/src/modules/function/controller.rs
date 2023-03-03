use std::str::FromStr;

use axum::{
    extract::{Multipart, Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde::Deserialize;
use serde_json::json;
use uuid::Uuid;

use crate::{
    authz::TokenClaims, modules::function_build::model::NewFunctionBuild,
    extras::types::{GetWorkspaceResourceQuery, SearchWorkspaceResourceQuery}, state::FaasbaseState,
};

use super::model::{NewFunction, UpdateFunction};

pub async fn get_function(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(function_id): Path<String>,
) -> impl IntoResponse {
    let function_id = Uuid::from_str(&function_id);
    match function_id {
        Ok(function_id) => {
            let res = faasbase.services.function.get_function(function_id);
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

pub async fn get_functions(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<GetWorkspaceResourceQuery>,
) -> impl IntoResponse {
    if let Some(name) = query.name.clone() {
        let res = faasbase
            .services
            .function
            .get_functions_by_name(name, query.workspace_id);
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
        let res =
            faasbase
                .services
                .function
                .get_functions(query.workspace_id, query.offset, query.limit);
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


pub async fn search_functions(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<SearchWorkspaceResourceQuery>,
) -> impl IntoResponse {
    let res = faasbase
        .services
        .function
        .search_functions(query.query.clone(), query.offset.clone(), query.limit.clone());
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
pub async fn create_function(
    Extension(faasbase): Extension<FaasbaseState>,
    Extension(_claims): Extension<TokenClaims>,
    Json(payload): Json<NewFunction>,
) -> impl IntoResponse {
    let res = faasbase.services.function.create_function(payload, _claims.user_id);
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

pub async fn update_function(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(function_id): Path<String>,
    Json(data): Json<UpdateFunction>,
) -> impl IntoResponse {
    let function_id = Uuid::from_str(&function_id);
    match function_id {
        Ok(function_id) => {
            let res = faasbase
                .services
                .function
                .update_function(function_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function updated successfully",
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

pub async fn delete_function(
    Extension(faasbase): Extension<FaasbaseState>,
    Path(function_id): Path<String>,
) -> impl IntoResponse {
    let function_id = Uuid::from_str(&function_id);
    match function_id {
        Ok(function_id) => {
            let res = faasbase.services.function.delete_function(function_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "function deleted successfully",
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

#[derive(Deserialize, Debug)]
pub struct UploadFucntionInput {
    pub name: String,
}

#[derive(Deserialize)]
pub struct UploadFunctionsQuery {
    pub version: String,
    pub workspace_id: String,
}

pub async fn upload_function(
    Extension(_faasbase): Extension<FaasbaseState>,
    Path(function_id): Path<String>,
    query: Query<UploadFunctionsQuery>,
    Extension(_claims): Extension<TokenClaims>,
    multipart: Multipart
) -> impl IntoResponse {
    let res = _faasbase
        .services
        .function
        .upload_function(function_id.clone(), multipart, query.version.clone())
        .await;
    match res {
        Ok(_res) => {
            let function_id = Uuid::from_str(&function_id);
            match function_id {
                Ok(function_id) => {
                    let res =
                        _faasbase
                            .services
                            .function_build
                            .create_function_build(NewFunctionBuild {
                                version: query.version.clone(),
                                changelog: None,
                                config: None,
                                function_id: Some(function_id),
                                user_id: Some(_claims.user_id),
                            });
                    match res {
                        Ok(res) => (
                            StatusCode::OK,
                            Json(json!({
                                "status": "ok",
                                "data": res,
                            })),
                        ),
                        Err(err) => {
                            println!("Error: {}", err);
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
                Err(_err) => (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({
                        "status": "error",
                        "error": "bad function id in url",
                    })),
                ),
            }
        }
        Err(err) => {
            println!("Error: {}", err);
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

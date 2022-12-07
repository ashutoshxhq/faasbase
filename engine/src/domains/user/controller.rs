use std::str::FromStr;

use super::model::UpdateUser;
use crate::{authz::TokenClaims, extras::types::GetUsersByQuery, state::FaaslyState};
use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Extension, Json,
};
use serde_json::json;
use uuid::Uuid;

pub async fn get_user(
    Extension(faasly): Extension<FaaslyState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let user_id = Uuid::from_str(&id);
    match user_id {
        Ok(user_id) => {
            let res = faasly.services.user.get_user(user_id).await;

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
                "error": "bad user id in url",
            })),
        ),
    }
}

pub async fn get_users(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<GetUsersByQuery>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .user
        .get_users(query.query.clone(), query.offset, query.limit);
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

pub async fn update_user(
    Extension(_faasly): Extension<FaaslyState>,
    Path(id): Path<String>,
    Json(data): Json<UpdateUser>,
) -> impl IntoResponse {
    let user_id = Uuid::from_str(&id);
    match user_id {
        Ok(user_id) => {
            let res = _faasly.services.user.update_user(user_id, data).await;

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "user updated successfully",
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
                "error": "bad user id in url",
            })),
        ),
    }
}

pub async fn delete_user(
    Extension(_faasly): Extension<FaaslyState>,
    Path(id): Path<String>,
) -> impl IntoResponse {
    let user_id = Uuid::from_str(&id);
    match user_id {
        Ok(user_id) => {
            let res = _faasly.services.user.delete_user(user_id).await;

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "user deleted successfully",
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
                "error": "bad user id in url",
            })),
        ),
    }
}

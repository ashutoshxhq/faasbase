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

use super::model::{NewDatabaseTableField, UpdateDatabaseTableField};

pub async fn get_table_field(
    Extension(faasly): Extension<FaaslyState>,
    Path((_table_id, field_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let field_id = Uuid::from_str(&field_id);
    match field_id {
        Ok(field_id) => {
            let res = faasly
                .services
                .fields
                .get_database_table_field(field_id);
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
                "error": "bad table id in url",
            })),
        ),
    }
}

pub async fn get_table_fields(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(table_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let table_id = Uuid::from_str(&table_id);
    match table_id {
        Ok(table_id) => {
            let res = faasly.services.fields.get_database_table_fields(
                table_id,
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
        Err(_err) => {
            println!("{:?}", _err);
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({
                    "status": "error",
                    "error": "bad application_resource id in url",
                })),
            )
        }
    }
}

pub async fn create_table_field(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewDatabaseTableField>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .fields
        .create_database_table_field(payload);
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

pub async fn update_table_field(
    Extension(faasly): Extension<FaaslyState>,
    Path((_table_id, field_id)): Path<(String, String)>,
    Json(data): Json<UpdateDatabaseTableField>,
) -> impl IntoResponse {
    let field_id = Uuid::from_str(&field_id);
    match field_id {
        Ok(field_id) => {
            let res = faasly
                .services
                .fields
                .update_database_table_field(field_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "table updated successfully",
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
                "error": "bad table id in url",
            })),
        ),
    }
}

pub async fn delete_table_field(
    Extension(faasly): Extension<FaaslyState>,
    Path((_table_id, field_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let field_id = Uuid::from_str(&field_id);
    match field_id {
        Ok(field_id) => {
            let res = faasly
                .services
                .fields
                .delete_database_table_field(field_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "table deleted successfully",
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
                "error": "bad table id in url",
            })),
        ),
    }
}

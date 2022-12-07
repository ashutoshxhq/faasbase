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

use super::model::{NewDatabaseTable, UpdateDatabaseTable};

pub async fn get_table(
    Extension(faasly): Extension<FaaslyState>,
    Path((_database_id, table_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let table_id = Uuid::from_str(&table_id);
    match table_id {
        Ok(table_id) => {
            let res = faasly
                .services
                .tables
                .get_database_table(table_id);
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

pub async fn get_tables(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Path(database_id): Path<String>,
    query: Query<Pagination>,
) -> impl IntoResponse {
    let database_id = Uuid::from_str(&database_id);
    match database_id {
        Ok(database_id) => {
            let res = faasly.services.tables.get_database_tables(
                database_id,
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

pub async fn create_table(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewDatabaseTable>,
) -> impl IntoResponse {
    let res = faasly
        .services
        .tables
        .create_database_table(payload);
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

pub async fn update_table(
    Extension(faasly): Extension<FaaslyState>,
    Path((_database_id, table_id)): Path<(String, String)>,
    Json(data): Json<UpdateDatabaseTable>,
) -> impl IntoResponse {
    let table_id = Uuid::from_str(&table_id);
    match table_id {
        Ok(table_id) => {
            let res = faasly
                .services
                .tables
                .update_database_table(table_id, data);

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

pub async fn delete_table(
    Extension(faasly): Extension<FaaslyState>,
    Path((_database_id, table_id)): Path<(String, String)>,
) -> impl IntoResponse {
    let table_id = Uuid::from_str(&table_id);
    match table_id {
        Ok(table_id) => {
            let res = faasly
                .services
                .tables
                .delete_database_table(table_id);

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

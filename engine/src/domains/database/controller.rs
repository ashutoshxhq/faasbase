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
    authz::TokenClaims, extras::types::{GetWorkspaceResourceQuery}, state::FaaslyState,
};

use super::model::{NewDatabase, UpdateDatabase};


pub async fn get_database(
    Extension(faasly): Extension<FaaslyState>,
    Path(database_id): Path<String>,
) -> impl IntoResponse {
    let database_id = Uuid::from_str(&database_id);
    match database_id {
        Ok(database_id) => {
            let res = faasly
                .services
                .databases
                .get_database(database_id);
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
                "error": "bad database id in url",
            })),
        ),
    }
}
pub async fn get_databases(
  Extension(faasly): Extension<FaaslyState>,
  Extension(_claims): Extension<TokenClaims>,
  query: Query<GetWorkspaceResourceQuery>,
) -> impl IntoResponse {
  let res = faasly.services.databases.get_databases(
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


pub async fn create_database(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    Json(payload): Json<NewDatabase>,
) -> impl IntoResponse {
    let res = faasly.services.databases.create_database(payload);
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


pub async fn update_database(
    Extension(faasly): Extension<FaaslyState>,
    Path(database_id): Path<String>,
    Json(data): Json<UpdateDatabase>,
) -> impl IntoResponse {
    let database_id = Uuid::from_str(&database_id);
    match database_id {
        Ok(database_id) => {
            let res = faasly
                .services
                .databases
                .update_database(database_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "database updated successfully",
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
                "error": "bad database id in url",
            })),
        ),
    }
}

pub async fn delete_database(
    Extension(faasly): Extension<FaaslyState>,
    Path(database_id): Path<String>,
) -> impl IntoResponse {
    let database_id = Uuid::from_str(&database_id);
    match database_id {
        Ok(database_id) => {
            let res = faasly
                .services
                .databases
                .delete_database(database_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "database deleted successfully",
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
                "error": "bad database id in url",
            })),
        ),
    }
}

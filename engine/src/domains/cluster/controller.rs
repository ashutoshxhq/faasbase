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
    authz::TokenClaims,
    extras::types::{GetWorkspaceResourceQuery},
    state::FaaslyState,
};

use super::model::{NewCluster, UpdateCluster};

pub async fn get_cluster(
    Extension(faasly): Extension<FaaslyState>,
    Path(cluster_id): Path<String>,
) -> impl IntoResponse {
    let cluster_id = Uuid::from_str(&cluster_id);
    match cluster_id {
        Ok(cluster_id) => {
            let res = faasly.services.cluster.get_cluster(cluster_id);
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
                "error": "bad cluster id in url",
            })),
        ),
    }
}

pub async fn get_clusters(
    Extension(faasly): Extension<FaaslyState>,
    Extension(_claims): Extension<TokenClaims>,
    query: Query<GetWorkspaceResourceQuery>,
) -> impl IntoResponse {
    let res =
        faasly
            .services
            .cluster
            .get_clusters(query.workspace_id, query.offset, query.limit);
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

pub async fn create_cluster(
    Extension(faasly): Extension<FaaslyState>,
    Json(payload): Json<NewCluster>,
) -> impl IntoResponse {
    let res = faasly.services.cluster.create_cluster(payload);
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

pub async fn update_cluster(
    Extension(faasly): Extension<FaaslyState>,
    Path(cluster_id): Path<String>,
    Json(data): Json<UpdateCluster>,
) -> impl IntoResponse {
    let cluster_id = Uuid::from_str(&cluster_id);
    match cluster_id {
        Ok(cluster_id) => {
            let res = faasly.services.cluster.update_cluster(cluster_id, data);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "cluster updated successfully",
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
                "error": "bad cluster id in url",
            })),
        ),
    }
}

pub async fn delete_cluster(
    Extension(faasly): Extension<FaaslyState>,
    Path(cluster_id): Path<String>,
) -> impl IntoResponse {
    let cluster_id = Uuid::from_str(&cluster_id);
    match cluster_id {
        Ok(cluster_id) => {
            let res = faasly.services.cluster.delete_cluster(cluster_id);

            match res {
                Ok(_res) => (
                    StatusCode::OK,
                    Json(json!({
                        "status": "ok",
                        "data": "cluster deleted successfully",
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
                "error": "bad cluster id in url",
            })),
        ),
    }
}

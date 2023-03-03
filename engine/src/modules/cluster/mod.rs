pub mod controller;
pub mod dto;
pub mod model;
pub mod service;

use axum::{
    middleware,
    routing::{delete, get, patch, post},
    Router,
};

use crate::authz::auth;

pub fn router() -> Router {
    Router::new()
        .route("/clusters/:cluster_id", get(controller::get_cluster))
        .route("/clusters", get(controller::get_clusters))
        .route("/clusters", post(controller::create_cluster))
        .route("/clusters/:cluster_id", patch(controller::update_cluster))
        .route("/clusters/:cluster_id", delete(controller::delete_cluster))
        .route_layer(middleware::from_fn(auth))
}

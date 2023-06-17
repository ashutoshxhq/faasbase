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
        .route("/workspaces", post(controller::create_workspace))
        .route(
            "/workspaces/:workspace_id",
            patch(controller::update_workspace),
        )
        .route(
            "/workspaces/:workspace_id",
            delete(controller::delete_workspace),
        )
        .route("/workspaces", get(controller::get_workspaces))
        .route_layer(middleware::from_fn(auth))
        .route(
            "/workspaces/:workspace_id",
            get(controller::get_workspace),
        )
}

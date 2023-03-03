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
        .route(
            "/workspaces/:workspace_id/members",
            get(controller::get_workspace_members),
        )
        .route(
            "/workspaces/:workspace_id/members",
            post(controller::create_workspace_member),
        )
        .route(
            "/workspaces/:workspace_id/members/:workspace_member_id",
            patch(controller::update_workspace_member),
        )
        .route(
            "/workspaces/:workspace_id/members/:workspace_member_id",
            delete(controller::delete_workspace_member),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/workspaces/:workspace_id/members/:workspace_member_id",
            get(controller::get_workspace_member),
        )
}

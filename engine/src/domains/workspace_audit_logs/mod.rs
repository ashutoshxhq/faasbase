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
            "/workspaces/:workspace_id/audit_logs",
            get(controller::get_audit_logs),
        )
        .route(
            "/workspaces/:workspace_id/audit_logs",
            post(controller::create_audit_log),
        )
        .route(
            "/workspaces/:workspace_id/audit_logs/:workspace_audit_log_id",
            patch(controller::update_audit_log),
        )
        .route(
            "/workspaces/:workspace_id/audit_logs/:workspace_audit_log_id",
            delete(controller::delete_audit_log),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/workspaces/:workspace_id/audit_logs/:workspace_audit_log_id",
            get(controller::get_audit_log),
        )
}

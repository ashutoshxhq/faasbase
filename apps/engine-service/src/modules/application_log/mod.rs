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
            "/applications/:application_id/logs",
            get(controller::get_application_logs),
        )
        .route(
            "/applications/:application_id/logs",
            post(controller::create_application_log),
        )
        .route(
            "/applications/:application_id/logs/:application_log_id",
            patch(controller::update_application_log),
        )
        .route(
            "/applications/:application_id/logs/:application_log_id",
            delete(controller::delete_application_log),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/applications/:application_id/logs/:application_log_id",
            get(controller::get_application_log),
        )
}

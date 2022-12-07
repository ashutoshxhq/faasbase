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
            "/functions/:function_id/builds",
            get(controller::get_function_builds),
        )
        .route(
            "/functions/:function_id/builds",
            post(controller::create_function_build),
        )
        .route(
            "/functions/:function_id/builds/:function_build_id",
            patch(controller::update_function_build),
        )
        .route(
            "/functions/:function_id/builds/:function_build_id",
            delete(controller::delete_function_build),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/functions/:function_id/builds/:function_build_id",
            get(controller::get_function_build),
        )
}

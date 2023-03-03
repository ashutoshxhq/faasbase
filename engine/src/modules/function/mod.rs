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
        .route("/functions", get(controller::get_functions))
        .route("/functions", post(controller::create_function))
        .route(
            "/functions/:function_id",
            patch(controller::update_function),
        )
        .route(
            "/functions/:function_id",
            delete(controller::delete_function),
        )
        .route(
            "/functions/:function_id/upload",
            post(controller::upload_function),
        )
        .route("/functions/search", get(controller::search_functions))
        .route_layer(middleware::from_fn(auth))
        .route("/functions/:function_id", get(controller::get_function))
}

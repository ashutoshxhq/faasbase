pub mod controller;
pub mod dto;
pub mod model;
pub mod service;

use axum::{
    middleware,
    routing::{delete, get, patch},
    Router,
};

use crate::authz::auth;

pub fn router() -> Router {
    Router::new()
        .route("/users", get(controller::get_users))
        .route("/users/:id", patch(controller::update_user))
        .route("/users/:id", delete(controller::delete_user))
        .route_layer(middleware::from_fn(auth))
        .route("/users/:id", get(controller::get_user))
}

pub mod controller;
pub mod model;
pub mod service;

use axum::{
    middleware,
    routing::post,
    Router,
};

use crate::authz::auth;

pub fn router() -> Router {
    Router::new()
        .route("/workers", post(controller::worker_ping))
        .route_layer(middleware::from_fn(auth))
}

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
        .route("/worker-ping", post(controller::worker_ping))
}

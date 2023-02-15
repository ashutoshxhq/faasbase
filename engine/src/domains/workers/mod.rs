pub mod controller;
pub mod model;
pub mod service;

use axum::{
    routing::post,
    Router,
};

pub fn router() -> Router {
    Router::new()
        .route("/worker-ping", post(controller::worker_ping))
}

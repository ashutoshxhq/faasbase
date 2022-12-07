pub mod controller;
pub mod dto;
pub mod model;
pub mod service;
use axum::{routing::post, Router};

pub fn router() -> Router {
    Router::new().route(
        "/authn/register-webhook",
        post(controller::register_webhook),
    )
}

pub mod controller;

use axum::{routing, Router};

use self::controller::health;

pub fn router() -> Router {
    Router::new()
        .route("/health", routing::get(health))
}

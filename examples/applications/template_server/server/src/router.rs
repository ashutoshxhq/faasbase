use axum::{middleware, routing::{post}, Router};

use crate::authz::auth;
pub fn router() -> Router {
    Router::new()
        .route_layer(middleware::from_fn(auth))
        .route("/hello", post(hello::handler))
}

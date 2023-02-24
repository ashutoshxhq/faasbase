use axum::{middleware, routing, Router};

use crate::{
    authz::auth,
    handler::{build_application, health},
};
pub fn router() -> Router {
    Router::new()
    .route("/build", routing::post(build_application))
    .route_layer(middleware::from_fn(auth))
    .route("/health", routing::get(health))
}

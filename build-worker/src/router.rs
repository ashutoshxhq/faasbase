use axum::{middleware, routing, Router};

use crate::{
    authz::auth,
    handler::{build_application, health},
};
pub fn router() -> Router {
    Router::new()
        .route("/health", routing::get(health))
        .route("/build", routing::post(build_application))
        .route_layer(middleware::from_fn(auth))
}

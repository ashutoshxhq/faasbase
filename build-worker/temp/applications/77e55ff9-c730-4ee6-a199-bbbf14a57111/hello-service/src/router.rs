use axum::{middleware, routing, Router};

use crate::authz::auth;
pub fn router() -> Router {
    Router::new()
	.route("/hello", routing::get(hello::handler))
    .route_layer(middleware::from_fn(auth))
}
        
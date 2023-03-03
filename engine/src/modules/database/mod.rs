pub mod controller;
pub mod model;
pub mod service;

use axum::{
    middleware,
    routing::{delete, get, patch, post},
    Router,
};

use crate::authz::auth;

pub fn router() -> Router {
    Router::new()
        .route("/databases/:database_id", get(controller::get_database))
        .route("/databases", get(controller::get_databases))
        .route("/databases", post(controller::create_database))
        .route(
            "/databases/:database_id",
            patch(controller::update_database),
        )
        .route(
            "/databases/:database_id",
            delete(controller::delete_database),
        )
        .route_layer(middleware::from_fn(auth))

}

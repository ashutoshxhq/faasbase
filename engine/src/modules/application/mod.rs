pub mod controller;
pub mod dto;
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
        .route("/applications", get(controller::get_applications))
        .route("/applications", post(controller::create_application))
        .route(
            "/applications/:application_id",
            patch(controller::update_application),
        )
        .route(
            "/applications/:application_id",
            delete(controller::delete_application),
        )
        .route("/applications/search", get(controller::search_applications))

        .route_layer(middleware::from_fn(auth))
        .route(
            "/applications/:application_id",
            get(controller::get_application),
        )

}

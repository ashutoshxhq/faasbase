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
        .route(
            "/applications/:application_id/builds",
            get(controller::get_application_builds),
        )
        .route(
            "/applications/:application_id/builds",
            post(controller::create_application_build),
        )
        .route(
            "/applications/:application_id/builds/:application_build_id",
            patch(controller::update_application_build),
        )
        .route(
            "/applications/:application_id/builds/:application_build_id",
            delete(controller::delete_application_build),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/applications/:application_id/builds/:application_build_id",
            get(controller::get_application_build),
        )
}

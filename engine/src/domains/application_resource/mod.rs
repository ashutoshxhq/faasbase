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
            "/applications/:application_id/resources",
            get(controller::get_application_resources),
        )
        .route(
            "/applications/:application_id/resources",
            post(controller::create_application_resource),
        )
        .route(
            "/applications/:application_id/resources/:application_resource_id",
            patch(controller::update_application_resource),
        )
        .route(
            "/applications/:application_id/resources/:application_resource_id",
            delete(controller::delete_application_resource),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/applications/:application_id/resources/:application_resource_id",
            get(controller::get_application_resource),
        )
}

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
            "/applications/:application_id/collaborators",
            get(controller::get_application_collaborators),
        )
        .route(
            "/applications/:application_id/collaborators",
            post(controller::create_application_collaborator),
        )
        .route(
            "/applications/:application_id/collaborators/:application_collaborator_id",
            patch(controller::update_application_collaborator),
        )
        .route(
            "/applications/:application_id/collaborators/:application_collaborator_id",
            delete(controller::delete_application_collaborator),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/applications/:application_id/collaborators/:application_collaborator_id",
            get(controller::get_application_collaborator),
        )
}

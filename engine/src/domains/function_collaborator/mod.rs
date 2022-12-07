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
            "/functions/:function_id/collaborators",
            get(controller::get_function_collaborators),
        )
        .route(
            "/functions/:function_id/collaborators",
            post(controller::create_function_collaborator),
        )
        .route(
            "/functions/:function_id/collaborators/:function_collaborator_id",
            patch(controller::update_function_collaborator),
        )
        .route(
            "/functions/:function_id/collaborators/:function_collaborator_id",
            delete(controller::delete_function_collaborator),
        )
        .route_layer(middleware::from_fn(auth))
        .route(
            "/functions/:function_id/collaborators/:function_collaborator_id",
            get(controller::get_function_collaborator),
        )
}

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
        .route("/databases/:database_id/tables/:table_id", get(controller::get_table))
        .route("/databases/:database_id/tables", get(controller::get_tables))
        .route("/databases/:database_id/tables", post(controller::create_table))
        .route(
            "/databases/:database_id/tables/:table_id",
            patch(controller::update_table),
        )
        .route(
            "/databases/:database_id/tables/:table_id",
            delete(controller::delete_table),
        )
        .route_layer(middleware::from_fn(auth))

}

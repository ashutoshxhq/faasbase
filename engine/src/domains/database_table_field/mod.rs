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
      .route("/databases/:database_id/tables/:table_id/fields/:field_id", get(controller::get_table_field))
        .route("/databases/:database_id/tables:table_id/fields", get(controller::get_table_fields))
        .route("/databases/:database_id/tables/:table_id/fields", post(controller::create_table_field))
        .route(
            "/databases/:database_id/tables/:table_id/fields/:field_id",
            patch(controller::update_table_field),
        )
        .route(
            "/databases/:database_id/tables/:table_id/fields/:field_id",
            delete(controller::delete_table_field),
        )
        .route_layer(middleware::from_fn(auth))

}

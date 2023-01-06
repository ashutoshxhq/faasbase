mod authz;
mod domains;
mod extras;
mod schema;
mod state;
use axum::{error_handling::HandleErrorLayer, http::StatusCode, BoxError, Extension, Router};
use domains::*;
use dotenvy::dotenv;
use state::FaaslyState;
use std::{env, net::SocketAddr, time::Duration};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};

#[tokio::main]
async fn main() {
    dotenv().ok();

    let format = tracing_subscriber::fmt::format()
        .with_level(true) // don't include levels in formatted output
        .with_target(true) // don't include targets
        .with_thread_ids(true) // include the thread ID of the current thread
        .with_thread_names(true) // include the name of the current thread
        .with_file(true)
        .with_line_number(true)
        .with_source_location(true)
        .with_ansi(false) // don't use ANSI escape codes
        .json(); // use the `Json` formatting style.

    // Create a `fmt` subscriber that uses our custom event format, and set it
    // as the default.
    tracing_subscriber::fmt()
        .event_format(format)
        .with_env_filter(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "faasly=debug,tower_http=debug".into()),
        ))
        .init();

    let app = Router::new().merge(router::router()).layer(
        ServiceBuilder::new()
            .layer(HandleErrorLayer::new(|error: BoxError| async move {
                if error.is::<tower::timeout::error::Elapsed>() {
                    Ok(StatusCode::REQUEST_TIMEOUT)
                } else {
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled internal error: {}", error),
                    ))
                }
            }))
            .timeout(Duration::from_secs(10))
            .layer(TraceLayer::new_for_http())
            .layer(Extension(FaaslyState::new()))
            .layer(
                CorsLayer::new()
                    .allow_origin(Any)
                    .allow_methods(Any)
                    .allow_headers(Any),
            )
            .into_inner(),
    );

    let addr = SocketAddr::from((
        [0, 0, 0, 0],
        env::var("PORT")
            .expect("Please set port in .env")
            .parse::<u16>()
            .unwrap(),
    ));
    tracing::debug!("Server started, listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

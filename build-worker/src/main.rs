mod router;
mod authz;
mod handler;
mod builder;
mod types;
mod generator;
mod engine_client;
use axum::{error_handling::HandleErrorLayer, http::StatusCode, BoxError, Router};
use dotenvy::dotenv;
use std::{env, net::SocketAddr, time::Duration};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};

#[tokio::main]
async fn main() {
    dotenv().ok();
    let app_env = std::env::var("APP_ENV").unwrap_or_else(|_| "prod".into());
    if app_env == "dev" {
        let format = tracing_subscriber::fmt::format()
        .with_level(true)
        .with_target(true)
        .with_thread_ids(true)
        .with_thread_names(true)
        .with_file(true)
        .with_line_number(true)
        .with_source_location(true)
        .compact();

    tracing_subscriber::fmt()
        .event_format(format)
        .with_env_filter(tracing_subscriber::EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "build-worker=debug,tower_http=debug".into()),
        ))
        .init();
    } else {
        let format = tracing_subscriber::fmt::format()
            .with_level(true)
            .with_target(true)
            .with_thread_ids(true)
            .with_thread_names(true)
            .with_file(true)
            .with_line_number(true)
            .with_source_location(true)
            .with_ansi(false)
            .json();
        tracing_subscriber::fmt()
            .event_format(format)
            .with_env_filter(tracing_subscriber::EnvFilter::new(
                std::env::var("RUST_LOG")
                    .unwrap_or_else(|_| "faasly=debug,tower_http=debug".into()),
            ))
            .init();
    }
        
    let app = Router::new().merge(router::router()).layer(
        ServiceBuilder::new()
            .layer(HandleErrorLayer::new(|error: BoxError| async move {
                if error.is::<tower::timeout::error::Elapsed>() {
                    Ok(StatusCode::REQUEST_TIMEOUT)
                } else {
                    tracing::error!("Unhandled internal error: {}", error);
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled internal error: {}", error),
                    ))
                }
            }))
            .timeout(Duration::from_secs(10))
            .layer(TraceLayer::new_for_http())
            .layer(
                CorsLayer::new()
                    .allow_origin(Any)
                    .allow_methods(Any)
                    .allow_headers(Any),
            )
            .into_inner(),
    );
        
    let port = match env::var("PORT") {
        Ok(port) => port.parse::<u16>().unwrap(),
        Err(_) => 8080
    };
            
   let addr = SocketAddr::from((
        [0, 0, 0, 0],
        port
    ));
    tracing::debug!("Server started, listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
    
    
}
        
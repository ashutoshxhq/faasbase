mod router;
mod authz;
mod handler;
mod builder;
mod types;
mod generator;
mod engine_client;
use axum::{error_handling::HandleErrorLayer, http::StatusCode, BoxError, Router};
use dotenvy::dotenv;
use pickledb::{PickleDb, PickleDbDumpPolicy, SerializationMethod};
use tracing::Level;
use std::{env, net::SocketAddr, time::Duration};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};
use types::WorkerPingPayload;
use engine_client::worker_ping;
use tracing_subscriber::FmtSubscriber;

#[tokio::main]
async fn main() {
    let mut db = PickleDb::new("status.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json);
    db.set("status", &String::from("FREE")).unwrap();

    dotenv().ok();
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::TRACE)
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");

    tokio::spawn(async move {
        loop {
            let db = PickleDb::load("status.db", PickleDbDumpPolicy::AutoDump, SerializationMethod::Json).unwrap();

            let status = db.get::<String>("status").unwrap();

            let result = worker_ping(WorkerPingPayload {
                hostname: env::var("HOSTNAME").unwrap(),
                status,
            }).await;
            
            if let Err(e) = result {
                tracing::error!("Error while calling engine service: {}", e);
            }
            tokio::time::sleep(Duration::from_secs(5)).await;
        }
    });

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
        
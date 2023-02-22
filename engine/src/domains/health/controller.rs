use axum::{response::IntoResponse, Json};
use hyper::StatusCode;
use redis::cluster::ClusterClient;
use serde_json::json;
use redis::Commands;


pub async fn health() -> impl IntoResponse {
    let nodes = vec![
        "redis://faasbase-worker-cache-0001-001.dzqmv1.0001.usw2.cache.amazonaws.com:6379/",
        "redis://faasbase-worker-cache-0001-002.dzqmv1.0001.usw2.cache.amazonaws.com:6379/",
        "redis://faasbase-worker-cache-0001-003.dzqmv1.0001.usw2.cache.amazonaws.com:6379/",
    ];

    let client = ClusterClient::new(nodes).unwrap();

    let mut connection = client.get_connection().unwrap();

    let _: () = connection.set("test", "test_data").unwrap();
    let rv: String = connection.get("test").unwrap();

    tracing::debug!("value: {}", rv);

    let hostname = std::env::var("HOSTNAME").unwrap_or_else(|_| "unknown".to_string());
    (
        StatusCode::OK,
        Json(json!({
            "status": "ok",
            "hostname": hostname,
        })),
    )
}

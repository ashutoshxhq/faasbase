use std::fs::File;
use std::io::prelude::*;

use crate::types::{ApplicationBuildContext, Error, ApplicationResourceConfig};

#[derive(Clone)]
pub struct ApplicationGeneratorService {}

impl ApplicationGeneratorService {
    pub fn new() -> Self {
        Self {}
    }

    pub fn generate_application(&self, context: ApplicationBuildContext) -> Result<(), Error> {
        self.generate_rust_application(context)?;
        Ok(())
    }

    pub fn generate_rust_application(&self, context: ApplicationBuildContext) -> Result<(), Error> {
        let main_rs = format!(
            r#"mod router;
mod authz;
use axum::{{error_handling::HandleErrorLayer, http::StatusCode, BoxError, Router}};
use dotenvy::dotenv;
use std::{{env, net::SocketAddr, time::Duration}};
use tower::ServiceBuilder;
use tower_http::{{
    cors::{{Any, CorsLayer}},
    trace::TraceLayer,
}};

#[tokio::main]
async fn main() {{
    dotenv().ok();
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
            std::env::var("RUST_LOG").unwrap_or_else(|_| "{}=debug,tower_http=debug".into()),
        ))
        .init();
        
    let app = Router::new().merge(router::router()).layer(
        ServiceBuilder::new()
            .layer(HandleErrorLayer::new(|error: BoxError| async move {{
                if error.is::<tower::timeout::error::Elapsed>() {{
                    Ok(StatusCode::REQUEST_TIMEOUT)
                }} else {{
                    Err((
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled internal error: {{}}", error),
                    ))
                }}
            }}))
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
        
    let port = match env::var("PORT") {{
        Ok(port) => port.parse::<u16>().unwrap(),
        Err(_) => 8000
    }};
            
   let addr = SocketAddr::from((
        [0, 0, 0, 0],
        port
    ));
    tracing::debug!("Server started, listening on {{}}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
    
    
}}
        "#,
            context.name
        );

        let mut jwks_uri = String::new();

        if let Some(config) = context.config {
            if let Some(jwt_enabled) = config.jwt_auth_enabled {
                if jwt_enabled {
                    if let Some(jwks_uri_string) = config.jwks_uri {
                        jwks_uri = jwks_uri_string;
                    }
                }
            }
        }


        if jwks_uri.is_empty() {
            jwks_uri.push_str(r#"format!(
                "https://{}/.well-known/jwks.json",
                std::env::var("JWKS_URI").expect("Unable to get JWKS_URI")
            )"#);
        }

        let authz_rs = format!(
            r#"
use std::error::Error;

use axum::{{
    http::{{header, Request, StatusCode}},
    middleware::Next,
    response::{{IntoResponse, Response}},
    Json,
}};
use hyper::Uri;
use jsonwebtoken::{{
    decode,
    jwk::{{AlgorithmParameters, JwkSet}},
    Algorithm, DecodingKey, Validation, decode_header,
}};
use jwt::{{Token, Header}};
use serde::{{Deserialize, Serialize}};
use serde_json::json;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenClaims {{
    pub user_id: Uuid,
    pub sub: String,
    pub aud: Vec<String>,
    pub iss: String,
    pub exp: u64,
    pub scope: String,
}}

pub async fn auth<B>(req: Request<B>, next: Next<B>) -> Response {{
    let (parts, body) = req.into_parts();
    let headers = parts.headers.clone();

    let auth_header = headers
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    if let Some(auth_header) = auth_header {{
        let auth_token = auth_header.split(" ").last();
        if let Some(auth_token) = auth_token {{
            let claims = decode_token(auth_token).unwrap();
            let mut new_req = Request::from_parts(parts, body);
            new_req.extensions_mut().insert(claims.clone());
            match is_autorized(auth_token).await {{
                Ok(is_autorized) => {{
                    if is_autorized {{
                    }} else {{
                        println!("is unauthorized");
                        return (
                            StatusCode::UNAUTHORIZED,
                            Json(json!({{
                                "error": "UNAUTHORIZED",
                                "status": "error",
                                "message": "Unauthorized: please provide a valid auth token",
                            }})),
                        )
                            .into_response();
                    }}
                }}
                Err(_err) => {{
                    println!("is unauthorized due to error {{:?}}", _err);

                    return (
                        StatusCode::UNAUTHORIZED,
                        Json(json!({{
                            "error": "UNAUTHORIZED",
                            "status": "error",
                            "message": "Unauthorized: please provide a valid auth token",
                        }})),
                    )
                        .into_response();
                }}
            }};
            return next.run(new_req).await;
        }} else {{
            println!("no token");
            return (
                StatusCode::UNAUTHORIZED,
                Json(json!({{
                    "error": "UNAUTHORIZED",
                    "status": "error",
                    "message": "Unauthorized: please provide a valid auth token",
                }})),
            )
                .into_response();
        }}
    }} else {{
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({{
                "error": "UNAUTHORIZED",
                "status": "error",
                "message": "Unauthorized: please provide a valid auth token",
            }})),
        )
            .into_response();
    }}
}}

async fn is_autorized(token: &str) -> Result<bool, Box<dyn Error>> {{
    let kid = get_kid_from_token(token)?;
    if let Some(kid) = kid {{
        let jwks = reqwest::get({})
        .await?
        .json::<JwkSet>()
        .await?;
        if let Some(jwk) = jwks.find(&kid) {{
            match jwk.clone().algorithm {{
                AlgorithmParameters::RSA(ref rsa) => {{
                    let mut validation = Validation::new(Algorithm::RS256);
                  
                    match std::env::var("JWT_AUDIENCE") {{
                        Ok(audience) => {{
                            validation.set_audience(&[&audience]);
                        }}
                        Err(_err) => {{}}
                    }}

                    match std::env::var("JWT_ISSUER") {{
                        Ok(issuer) => {{
                            validation.set_issuer(&[Uri::builder()
                                .scheme("https")
                                .authority(issuer)
                                .path_and_query("/")
                                .build()?]);
                        }}
                        Err(_err) => {{}}
                    }}

                    let key = DecodingKey::from_rsa_components(&rsa.n, &rsa.e)?;
                    decode::<TokenClaims>(token, &key, &validation)?;
                    return Ok(true);
                }}
                _ => return Ok(false),
            }}
        }}
    }}
    Ok(false)
}}

pub fn decode_token(auth_token: &str) -> Result<TokenClaims, Box<dyn Error>> {{
    let unverified: Token<Header, TokenClaims, _> = Token::parse_unverified(auth_token)?;
    Ok(unverified.claims().clone())
}}

pub fn get_kid_from_token(auth_token: &str) -> Result<Option<String>, Box<dyn Error>> {{
    let header = decode_header(&auth_token)?;
    Ok(header.kid)
}}
"#,
            jwks_uri
        );

        let mut function_imports = String::new();

        for resource in context.resources.clone() {
            let resource_name = resource.resource_name;
            function_imports.push_str(&format!(
                "\n{} = {{ path = \"./lib/{}\" }}",
                resource_name, resource_name
            ));
        }

        let cargo_toml = format!(
            r#"
[package]
name = "{}"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[dependencies]
axum = {{ version = "0.5.3", features= ["multipart"] }}
tokio = {{ version = "1.17", features = ["full"] }}
tracing = "0.1.34"
tracing-subscriber = {{ version = "0.3", features = ["env-filter", "json"] }}
hyper = "0.14"
tower = {{ version = "0.4.12", features = ["util", "timeout", "load-shed", "limit"] }}
tower-http = {{ version = "0.3.0", features = ["add-extension", "auth", "compression-full", "trace", "map-request-body", "util", "cors"] }}
serde = {{ version = "1.0", features = ["derive"]}}
serde_json = "1.0.68"
uuid = {{ version = "1.0.0", features = ["v4", "serde"] }}
diesel = {{ version = "2.0.0", features = ["postgres", "r2d2", "uuid", "serde_json", "chrono"] }}
dotenvy = "0.15"
jsonwebtoken = "8.1.1"
jwt = "0.16.0"
reqwest = {{ version = "0.11", features = ["blocking", "json"] }}
schemars ={{ version = "0.8.10", features = ["chrono", "uuid1"]}}
chrono = {{ version = "0.4.22", features = ["serde"]}}
utoipa-swagger-ui = "2"
utoipa = {{ version = "2", features = ["actix_extras"] }}
urlencoding = "2.1.2"
itertools = "0.10.5"
{}
    "#,
            context.name, function_imports
        );

        let mut routes = String::new();
        for resource in context.resources {
            if let Some(resource_config) = resource.config {
                let resource_config: ApplicationResourceConfig =
                    serde_json::from_value(resource_config)?;
                if let Some(endpoint) = resource_config.endpoint {
                    if let Some(method) = resource_config.method {
                        routes.push_str(&format!(
                            "\n\t.route(\"{}\", routing::{}({}::handler))",
                            endpoint, method.to_lowercase(), resource.resource_name
                        ));
                    } else {
                        tracing::warn!(
                            "No method specified for resource {}",
                            resource.resource_name
                        );
                    }
                } else {
                    tracing::warn!(
                        "No endpoint specified for resource {}",
                        resource.resource_name
                    );
                }
            }
        }

        let router_rs = format!(
            r#"use axum::{{middleware, routing, Router}};

use crate::authz::auth;
pub fn router() -> Router {{
    Router::new(){}
    .route_layer(middleware::from_fn(auth))
}}
        "#,
            routes
        );

        let dockerfile = format!(
            r#"
FROM rust:1.65 as builder

RUN USER=root cargo new --bin {}
WORKDIR ./{}
COPY ./Cargo.toml ./Cargo.toml
# RUN cargo build --release
# RUN rm src/*.rs

ADD . ./

# RUN rm ./target/release/deps/{}*
RUN cargo build --release


FROM debian:bullseye-slim

ARG APP=/usr/src/app

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates tzdata libpq-dev gcc libc6-dev curl gnupg lsb-release \
    && rm -rf /var/lib/apt/lists/*
    

EXPOSE 8000

ENV TZ=Etc/UTC \
    APP_USER=appuser

RUN groupadd $APP_USER \
    && useradd -g $APP_USER $APP_USER \
    && mkdir -p ${{APP}}

COPY --from=builder /{}/target/release/{} ${{APP}}/{}

RUN chown -R $APP_USER:$APP_USER ${{APP}}

USER $APP_USER
WORKDIR ${{APP}}

CMD ["./{}"]"#,
            context.name,
            context.name,
            context.name,
            context.name,
            context.name,
            context.name,
            context.name
        );

        
        let mut file = File::create(&format!("temp/applications/{}/{}/Dockerfile", context.id, context.name))?;
        file.write_all(dockerfile.as_bytes())?;

        let mut file = File::create(&format!("temp/applications/{}/{}/Cargo.toml", context.id, context.name))?;
        file.write_all(cargo_toml.as_bytes())?;
        
        let mut file = File::create(&format!("temp/applications/{}/{}/src/main.rs", context.id, context.name))?;
        file.write_all(main_rs.as_bytes())?;

        let mut file = File::create(&format!("temp/applications/{}/{}/src/router.rs", context.id, context.name))?;
        file.write_all(router_rs.as_bytes())?;

        let mut file = File::create(&format!("temp/applications/{}/{}/src/authz.rs", context.id, context.name))?;
        file.write_all(authz_rs.as_bytes())?;

        
        Ok(())

    }
}

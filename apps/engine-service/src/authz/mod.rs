use std::error::Error;

use axum::{
    http::{header, Request, StatusCode},
    middleware::Next,
    response::{IntoResponse, Response},
    Json,
};
use hyper::Uri;
use jsonwebtoken::{
    decode,
    jwk::{AlgorithmParameters, JwkSet},
    Algorithm, DecodingKey, Validation, decode_header,
};
use jwt::{Token, Header};
use serde::{Deserialize, Serialize};
use serde_json::json;
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenClaims {
    pub user_id: Uuid,
    pub sub: String,
    pub aud: Vec<String>,
    pub iss: String,
    pub exp: u64,
    pub scope: String,
}

pub async fn auth<B>(req: Request<B>, next: Next<B>) -> Response {
    let (parts, body) = req.into_parts();
    let headers = parts.headers.clone();

    let auth_header = headers
        .get(header::AUTHORIZATION)
        .and_then(|header| header.to_str().ok());

    if let Some(auth_header) = auth_header {
        let auth_token = auth_header.split(" ").last();
        if let Some(auth_token) = auth_token {
            let claims = decode_token(auth_token).unwrap();
            let mut new_req = Request::from_parts(parts, body);
            new_req.extensions_mut().insert(claims.clone());
            match is_autorized(auth_token).await {
                Ok(is_autorized) => {
                    if is_autorized {
                    } else {
                        println!("is unauthorized");
                        return (
                            StatusCode::UNAUTHORIZED,
                            Json(json!({
                                "error": "UNAUTHORIZED",
                                "status": "error",
                                "message": "Unauthorized: please provide a valid auth token",
                            })),
                        )
                            .into_response();
                    }
                }
                Err(_err) => {
                    println!("is unauthorized due to error {:?}", _err);

                    return (
                        StatusCode::UNAUTHORIZED,
                        Json(json!({
                            "error": "UNAUTHORIZED",
                            "status": "error",
                            "message": "Unauthorized: please provide a valid auth token",
                        })),
                    )
                        .into_response();
                }
            };
            return next.run(new_req).await;
        } else {
            println!("no token");
            return (
                StatusCode::UNAUTHORIZED,
                Json(json!({
                    "error": "UNAUTHORIZED",
                    "status": "error",
                    "message": "Unauthorized: please provide a valid auth token",
                })),
            )
                .into_response();
        }
    } else {
        return (
            StatusCode::UNAUTHORIZED,
            Json(json!({
                "error": "UNAUTHORIZED",
                "status": "error",
                "message": "Unauthorized: please provide a valid auth token",
            })),
        )
            .into_response();
    }
}

async fn is_autorized(token: &str) -> Result<bool, Box<dyn Error>> {
    let kid = get_kid_from_token(token)?;
    if let Some(kid) = kid {
        let jwks = reqwest::get(format!(
            "https://{}/.well-known/jwks.json",
            std::env::var("AUTH0_DOMAIN").expect("Unable to get AUTH0_DOMAIN")
        ))
        .await?
        .json::<JwkSet>()
        .await?;
        if let Some(jwk) = jwks.find(&kid) {
            match jwk.clone().algorithm {
                AlgorithmParameters::RSA(ref rsa) => {
                    let mut validation = Validation::new(Algorithm::RS256);
                    validation.set_audience(&[
                        &std::env::var("AUTH0_AUDIENCE").expect("Unable to get AUTH0_AUDIENCE")
                    ]);
                    validation.set_issuer(&[Uri::builder()
                        .scheme("https")
                        .authority(
                            std::env::var("AUTH0_DOMAIN").expect("Unable to get AUTH0_DOMAIN"),
                        )
                        .path_and_query("/")
                        .build()?]);
                    let key = DecodingKey::from_rsa_components(&rsa.n, &rsa.e)?;
                    decode::<TokenClaims>(token, &key, &validation)?;
                    return Ok(true);
                }
                _ => return Ok(false),
            }
        }
    }
    Ok(false)
}

pub fn decode_token(auth_token: &str) -> Result<TokenClaims, Box<dyn Error>> {
    let unverified: Token<Header, TokenClaims, _> = Token::parse_unverified(auth_token)?;
    Ok(unverified.claims().clone())
}

pub fn get_kid_from_token(auth_token: &str) -> Result<Option<String>, Box<dyn Error>> {
    let header = decode_header(&auth_token)?;
    Ok(header.kid)
}

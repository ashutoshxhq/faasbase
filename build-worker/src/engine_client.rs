// write a function to call engine service application build update api

use crate::types::{Error, FaasbaseError, UpdateApplicationBuild};

pub async fn update_application_build(
    application_build_id: String,
    application_build: UpdateApplicationBuild,
    access_token: String,
) -> Result<(), Error> {
    let client = reqwest::Client::new();
    let url = format!(
        "{}/applications/builds/{}",
        std::env::var("ENGINE_SERVICE_URL").unwrap(),
        application_build_id
    );
    let response = client
        .patch(&url)
        .json(&application_build)
        .header("Authorization", format!("Bearer {}", access_token))
        .send()
        .await
        .map_err(|e| {
            FaasbaseError::new(
                "ENGINE_SERVICE_ERROR".to_string(),
                format!("Error while calling engine service: {}", e),
                500,
            )
        })?;
    if response.status().is_success() {
        Ok(())
    } else {
        Err(FaasbaseError::new(
            "ENGINE_SERVICE_ERROR".to_string(),
            format!(
                "Error while calling engine service: {}",
                response.text().await?
            ),
            500,
        ))
    }
}

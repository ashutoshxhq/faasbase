mod builder;
mod engine_client;
mod generator;
mod types;

use aws_config::meta::region::RegionProviderChain;
use aws_credential_types::Credentials;
use aws_sdk_sqs as sqs;
use builder::ApplicationBuilder;
use dotenvy::dotenv;
use tracing::Level;
use tracing_subscriber::FmtSubscriber;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::DEBUG)
        .with_level(true)
        .with_line_number(true)
        .with_file(true)
        .with_ansi(false)
        .compact()
        .finish();
    
    tracing::subscriber::set_global_default(subscriber).expect("setting default subscriber failed");
    let access_key_id =
        std::env::var("FAASBASE_AWS_ACCESS_KEY_ID").expect("AWS_ACCESS_KEY_ID must be set");
    let secret_access_key =
        std::env::var("FAASBASE_AWS_SECRET_ACCESS_KEY").expect("AWS_SECRET_ACCESS_KEY must be set");
    let aws_region = std::env::var("FAASBASE_AWS_DEFAULT_REGION").expect("AWS_REGION must be set");

    let region_provider =
        RegionProviderChain::first_try(aws_types::region::Region::new(aws_region));
    let credentials_provider =
        Credentials::new(access_key_id, secret_access_key, None, None, "faasbase");

    let shared_config = aws_config::from_env()
        .credentials_provider(credentials_provider)
        .region(region_provider)
        .load()
        .await;
    let client = sqs::Client::new(&shared_config);

    loop {
        let queue_url =
            std::env::var("BUILD_REQUEST_SQS_URL").expect("BUILD_REQUEST_SQS_URL must be set");

        let rcv_message_output = client
            .receive_message()
            .set_wait_time_seconds(Some(10))
            .max_number_of_messages(1)
            .queue_url(queue_url.clone())
            .send()
            .await
            .unwrap();

        for message in rcv_message_output.messages.unwrap_or_default() {
            let application_build_message_result = serde_json::from_str::<
                types::ApplicationBuildMessage,
            >(message.body.unwrap().as_str());

            match application_build_message_result {
                Ok(application_build_message) => {
                    let application_build_context_result =
                        serde_json::from_str::<types::ApplicationBuildContext>(
                            &application_build_message.message,
                        );
                    match application_build_context_result {
                        Ok(application_build_context) => {
                            let application_builder = ApplicationBuilder::new(
                                application_build_context,
                                application_build_message
                                    .message_attributes
                                    .authorization
                                    .value,
                            );
                            let application_build_result = application_builder.build().await;
                            match application_build_result {
                                Ok(_) => {
                                    tracing::info!("Application built successfully");
                                    let delete_message_output = client
                                        .delete_message()
                                        .queue_url(queue_url.clone())
                                        .receipt_handle(message.receipt_handle.unwrap())
                                        .send()
                                        .await
                                        .unwrap();
                                    tracing::info!(
                                        "Deleted the message: {:#?}",
                                        delete_message_output
                                    );
                                }
                                Err(_) => {
                                    tracing::error!("Error while building the application");
                                }
                            }
                        }
                        Err(err) => {
                            tracing::error!("Error while parsing the message: {:#?}", err);
                            let _delete_message_output = client
                                .delete_message()
                                .queue_url(queue_url.clone())
                                .receipt_handle(message.receipt_handle.unwrap())
                                .send()
                                .await
                                .unwrap();
                            continue;
                        }
                    }
                }
                Err(_) => {
                    tracing::error!(
                        "Error while parsing the message: {:#?}",
                        application_build_message_result
                    );
                    let _delete_message_output = client
                        .delete_message()
                        .queue_url(queue_url.clone())
                        .receipt_handle(message.receipt_handle.unwrap())
                        .send()
                        .await
                        .unwrap();
                    continue;
                }
            }
        }
    }
}

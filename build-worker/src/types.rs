use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use serde_json::Value;
use uuid::Uuid;


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationBuildContext {
    pub id: Uuid,
    pub name: String,
    pub application_type: String,
    pub build_version: String,
    pub description: Option<String>,
    pub readme: Option<String>,
    pub visibility: String,
    pub repository: Option<String>,
    pub website: Option<String>,
    pub deployed_version: Option<String>,
    pub size: Option<String>,
    pub config: Option<ApplicationConfig>,
    pub variables: Option<Value>,
    pub resources: Vec<ApplicationResourceWithFunction>,
    pub cluster: Option<Cluster>,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkerPingPayload {
    pub hostname: String,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, PartialEq, Clone)]
pub struct ApplicationResourceWithFunction {
    pub id: Uuid,
    pub resource_type: String,
    pub resource_name: String,
    pub config: Option<Value>,
    pub resource_id: Option<Uuid>,
    pub application_id: Uuid,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Cluster {
    pub id: Uuid,
    pub name: String,
    pub provider: String,
    pub provider_config: Value,
    pub cluster_config: String,
    pub user_id: Option<Uuid>,
    pub workspace_id: Option<Uuid>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub deleted_at: Option<NaiveDateTime>,
}


#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationConfig {
    pub deployment_target: Option<String>,
    pub jwks_uri: Option<String>,
    pub jwt_algorithm: Option<String>,
    pub jwt_auth_enabled: Option<bool>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ClusterProviderConfig {
    pub aws_access_key_id: Option<String>,
    pub aws_secret_access_key: Option<String>,
    pub region: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationResourceConfig {
    pub endpoint: Option<String>,
    pub method: Option<String>,
    pub version: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ApplicationVariables {
    pub config_vars: Option<Vec<Variable>>,
    pub secrets: Option<Vec<Variable>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Variable {
    pub id: String,
    pub key: String,
    pub value: String,
}


pub type Error = Box<dyn std::error::Error + Send + Sync + 'static>;

use std::error;
use std::fmt;
#[derive(Debug)]
pub struct FaasbaseError {
    error_message: String,
    error_code: String,
    status_code: u32,
}

impl FaasbaseError {
    pub fn new(error_code: String, error_message: String, status_code: u32) -> Box<Self> {
        Box::new(Self {
            error_code,
            error_message,
            status_code,
        })
    }
}

impl fmt::Display for FaasbaseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "({} ({}): {})",
            self.error_code, self.status_code, self.error_message
        )
    }
}

impl error::Error for FaasbaseError {}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateApplicationBuild {
    pub version: String,
    pub changelog: Option<String>,
    pub config: Option<Value>,
    pub deleted_at: Option<NaiveDateTime>,
    pub build_status: Option<String>,
    pub deployment_status: Option<String>,
    pub logs: Option<Value>,
    pub built_at: Option<NaiveDateTime>,
    pub deployed_at: Option<NaiveDateTime>,
}


#[derive(Debug, Serialize, Deserialize)]
pub struct ApplicationBuildMessage {
    #[serde(rename="Type")]
    pub message_type: String,
    #[serde(rename="MessageId")]
    pub message_id: String,
    #[serde(rename="TopicArn")]
    pub topic_arn: String,
    #[serde(rename="Message")]
    pub message: String,
    #[serde(rename="Timestamp")]
    pub timestamp: String,
    #[serde(rename="SignatureVersion")]
    pub signature_version: String,
    #[serde(rename="Signature")]
    pub signature: String,
    #[serde(rename="SigningCertURL")]
    pub signing_cert_url: String,
    #[serde(rename="UnsubscribeURL")]
    pub unsubscribe_url: String,
    #[serde(rename="MessageAttributes")]
    pub message_attributes: ApplicationBuildMessageAttribute,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ApplicationBuildMessageAttribute {
    #[serde(rename="Authorization")]
    pub authorization: MessageAttribute,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MessageAttribute {
    #[serde(rename="Type")]
    pub attribute_type: String,
    #[serde(rename="Value")]
    pub value: String,
}
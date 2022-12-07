use crate::{
    domains::{
        user::model::{NewUser, UpdateUser, User},
        workspace_members::model::{NewWorkspaceMember, WorkspaceMember},
        workspaces::model::{NewWorkspace, Workspace},
    },
    extras::{types::RegisterWebhookRequest, TokenResponse},
    schema::users::dsl,
    schema::{users, workspace_members, workspaces},
    state::DbPool,
};

use diesel::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{collections::HashMap, error::Error};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct RegisterWebhook {
    pub user_id: Uuid,
}

#[derive(Clone)]
pub struct AuthNService {
    pub pool: DbPool,
}

impl AuthNService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub async fn register_webhook(
        &self,
        data: RegisterWebhookRequest,
    ) -> Result<RegisterWebhook, Box<dyn Error + Send + Sync + 'static>> {
        let mut conn = self.pool.clone().get()?;

        let existing_user= dsl::users
            .filter(dsl::email.eq(data.email.clone()))
            .first::<User>(&mut conn).optional()?;
        
        if let Some(user) = existing_user {
            return Ok(RegisterWebhook {
                user_id: user.id,
            });
        }
        

        let created_user: User = diesel::insert_into(users::table)
            .values(&NewUser {
                firstname: data.firstname.clone(),
                lastname: data.lastname.clone(),
                username: Some(data.username.clone()),
                email: Some(data.email.clone()),
                profile_pic: None,
                connection: None,
                metadata: None,
                readme: None,
                timezone: None,
                idp_user_id: data.idp_user_id.clone(),
            })
            .get_result(&mut conn)?;

        let created_workspace: Workspace = diesel::insert_into(workspaces::table)
            .values(&NewWorkspace {
                name: data.username.clone(),
                description: Some("Personal Workspace".to_string()),
                email: Some(data.email.clone()),
                location: None,
                readme: None,
                twitter: None,
                website: None,
            })
            .get_result(&mut conn)?;

        let _created_workspace_member: WorkspaceMember =
            diesel::insert_into(workspace_members::table)
                .values(&NewWorkspaceMember {
                    workspace_id: created_workspace.id,
                    role: "OWNER".to_string(),
                    user_id: created_user.id,
                })
                .get_result(&mut conn)?;

        let client = reqwest::Client::new();
        let audience = format!(
            "https://{}/api/v2/",
            std::env::var("AUTH0_DOMAIN").expect("Unable to get AUTH0_DOMAIN")
        );
        let token_res = client
            .post(format!(
                "https://{}/oauth/token",
                std::env::var("AUTH0_DOMAIN").expect("Unable to get AUTH0_DOMAIN")
            ))
            .json(&json!({
                "grant_type": "client_credentials",
                "client_id": std::env::var("AUTH0_CLIENT_ID").expect("Unable to get AUTH0_CLIENT_ID"),
                "client_secret": std::env::var("AUHT0_CLIENT_SECRET").expect("Unable to get AUHT0_CLIENT_SECRET"),
                "audience": audience
            }))
            .send()
            .await?
            .json::<TokenResponse>()
            .await?;
        let access_token = token_res.access_token;
        let _res = client
            .patch(format!(
                "https://{}/api/v2/users/{}",
                std::env::var("AUTH0_DOMAIN").expect("Unable to get AUTH0_DOMAIN"),
                data.idp_user_id.clone()
            ))
            .json(&json!({
              "user_metadata": {
                "user_id": created_user.id,
              }
            }))
            .header("authorization", format!("Bearer {}", access_token))
            .send()
            .await?
            .json::<HashMap<String, Value>>()
            .await?;

        let email = _res.get("email");
        let username = _res.get("username");
        if let Some(email) = email {
            if let Some(username) = username {
                let _user = diesel::update(dsl::users.find(created_user.id))
                    .set(&UpdateUser {
                        email: serde_json::from_value(email.clone())?,
                        username: serde_json::from_value(username.clone())?,
                        firstname: None,
                        lastname: None,
                        connection: None,
                        idp_user_id: None,
                        profile_pic: None,
                        readme: None,
                        timezone: None,
                        metadata: None,
                        deleted_at: None,
                    })
                    .get_result::<User>(&mut conn)?;
            }
        }
        Ok(RegisterWebhook {
            user_id: created_user.id,
        })
    }
}

use crate::extras::types::{Error, FaasbaseError};
use crate::modules::function_build::model::FunctionBuild;
use crate::modules::function_collaborator::model::{FunctionCollaborator, NewFunctionCollaborator};
use crate::schema::function_builds::dsl as function_builds_dsl;
use crate::schema::{function_collaborators, function_stars};
use crate::schema::function_forks::dsl as function_forks_dsl;
use crate::schema::functions::{self, dsl};
use crate::state::DbPool;
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_s3::types::ByteStream;
use aws_sdk_s3::{Client, Region};
use axum::extract::Multipart;
use diesel::prelude::*;
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use uuid::Uuid;

use super::model::{
    CreateFunctionFork, ForkFunction, Function, FunctionFork, FunctionWithBuilds, NewFunction,
    UpdateFunction, CreateFunctionStar, FunctionStar,
};

#[derive(Clone)]
pub struct FunctionService {
    pub pool: DbPool,
}

impl FunctionService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_function(&self, function_id: Uuid) -> Result<Function, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: Function = dsl::functions.find(function_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_functions(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<FunctionWithBuilds>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let functions: Vec<Function> = dsl::functions
            .filter(dsl::workspace_id.eq(workspace_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;

        let function_ids: Vec<Uuid> = functions.iter().map(|f| f.id).collect();

        let function_builds: Vec<FunctionBuild> = function_builds_dsl::function_builds
            .filter(function_builds_dsl::function_id.eq_any(function_ids))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;

        let mut function_with_builds: Vec<FunctionWithBuilds> = Vec::new();
        for function in functions {
            let mut builds: Vec<FunctionBuild> = Vec::new();
            for build in function_builds.clone() {
                if build.function_id == function.id {
                    builds.push(build);
                }
            }
            function_with_builds.push(FunctionWithBuilds {
                created_at: function.created_at,
                description: function.description,
                id: function.id,
                name: function.name,
                readme: function.readme,
                updated_at: function.updated_at,
                visibility: function.visibility,
                workspace_id: function.workspace_id,
                deleted_at: function.deleted_at,
                latest_version: function.latest_version,
                repository: function.repository,
                size: function.size,
                user_id: function.user_id,
                website: function.website,
                builds,
            });
        }

        Ok(function_with_builds)
    }

    pub fn search_functions(
        &self,
        query: String,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<Function>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let functions = dsl::functions;
        let results;
        if query.eq("") {
            results = functions
                .filter(dsl::visibility.eq("PUBLIC"))
                .offset(offset)
                .limit(limit)
                .load(&mut conn)?;
        } else {
            results = functions
                .filter(
                    dsl::name
                        .ilike(format!("%{}%", query.clone()))
                        .or(dsl::description.ilike(format!("%{}%", query.clone())))
                        .or(dsl::readme.ilike(format!("%{}%", query.clone())))
                        .and(dsl::visibility.eq("PUBLIC")),
                )
                .offset(offset)
                .limit(limit)
                .load(&mut conn)?;
        }
        Ok(results)
    }

    pub fn get_functions_by_name(
        &self,
        name: String,
        workspace_id: Uuid,
    ) -> Result<Function, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Function = dsl::functions
            .filter(dsl::name.eq(name).and(dsl::workspace_id.eq(workspace_id)))
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn create_function(&self, data: NewFunction, user_id: Uuid) -> Result<Function, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Function = diesel::insert_into(functions::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new Function");

        let _collab: FunctionCollaborator = diesel::insert_into(function_collaborators::table)
            .values(&NewFunctionCollaborator {
                permission: "OWNER".to_string(),
                collaborator_id: user_id,
                function_id: results.id,
            })
            .get_result(&mut conn)
            .expect("Error saving new function_collaborators");
        Ok(results)
    }

    pub fn update_function(&self, function_id: Uuid, data: UpdateFunction) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _function_statement = diesel::update(dsl::functions.find(function_id))
            .set(&data)
            .get_result::<Function>(&mut conn)?;

        Ok(())
    }

    pub fn delete_function(&self, function_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::functions.find(function_id))
            .execute(&mut conn)
            .expect("Error deleting Function");
        Ok(())
    }

    pub async fn upload_function(
        &self,
        id: String,
        mut data: Multipart,
        version: String,
    ) -> Result<(), Error> {
        let current_dir = std::env::current_dir()?;
        while let Some(field) = data.next_field().await? {
            match field.file_name() {
                Some(_file_name) => {
                    let data = field.bytes().await?;
                    let function_path = format!("temp/functions/{}/function.zip", id);
                    if !Path::new(&format!("temp/functions/{}", id)).exists() {
                        fs::create_dir_all(current_dir.join(format!("temp/functions/{}", id)))?;
                    }

                    let mut file = File::create(current_dir.join(function_path))?;
                    file.write_all(&data)?;
                }
                _ => {
                    return Err(FaasbaseError::new(
                        "UPLOAD_ERROR".to_string(),
                        "unable to read file name".to_string(),
                        400,
                    ));
                }
            }
        }

        let region_provider = RegionProviderChain::first_try(Region::new("us-west-2"));

        let shared_config = aws_config::from_env().region(region_provider).load().await;
        let client = Client::new(&shared_config);

        let body = ByteStream::from_path(Path::new(
            &current_dir.join(format!("temp/functions/{}/function.zip", id)),
        ))
        .await?;
        let _res = client
            .put_object()
            .set_bucket(Some("faasbase-functions".to_string()))
            .set_key(Some(format!("{}/{}/function.zip", id, version)))
            .set_body(Some(body))
            .send()
            .await?;

        fs::remove_file(&current_dir.join(format!("temp/functions/{}/function.zip", id)))?;

        Ok(())
    }

    pub async fn fork_function(&self, data: ForkFunction) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        let function: Function = dsl::functions
            .filter(dsl::id.eq(data.function_id))
            .first(&mut conn)?;

        let new_function = NewFunction {
            name: data.name,
            description: function.description,
            readme: function.readme,
            visibility: function.visibility,
            workspace_id: Some(data.workspace_id),
            user_id: Some(data.user_id),
            latest_version: function.latest_version,
            size: function.size,
            repository: function.repository,
            website: function.website,
        };

        let results: Function = diesel::insert_into(functions::table)
            .values(&new_function)
            .get_result(&mut conn)?;

        let _function_fork_statement = diesel::insert_into(function_forks_dsl::function_forks)
            .values(&CreateFunctionFork {
                source_function_id: data.function_id,
                target_function_id: results.id,
                workspace_id: data.workspace_id,
                user_id: data.user_id,
            })
            .get_result::<FunctionFork>(&mut conn)?;
        Ok(())
    }

    pub fn star_function(&self, function_id: Uuid, user_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        
        let _function_statement = diesel::insert_into(function_stars::dsl::function_stars)
            .values(&CreateFunctionStar{
                function_id,
                user_id,
            })
            .get_result::<FunctionStar>(&mut conn)?;

        Ok(())
    }
}

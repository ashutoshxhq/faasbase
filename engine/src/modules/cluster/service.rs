use crate::extras::types::Error;
use crate::schema::clusters::{self, dsl};
use crate::state::DbPool;
use diesel::prelude::*;
use uuid::Uuid;

use super::model::{Cluster, NewCluster, UpdateCluster};

#[derive(Clone)]
pub struct ClusterService {
    pub pool: DbPool,
}

impl ClusterService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_cluster(&self, cluster_id: Uuid) -> Result<Cluster, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: Cluster = dsl::clusters.find(cluster_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_clusters(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<Cluster>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results: Vec<Cluster> = dsl::clusters.filter(dsl::workspace_id.eq(workspace_id)).offset(offset).limit(limit).load(&mut conn)?;
        Ok(results)
    }

    pub fn create_cluster(&self, data: NewCluster) -> Result<Cluster, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Cluster = diesel::insert_into(clusters::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new cluster");
        Ok(results)
    }

    pub fn update_cluster(&self, cluster_id: Uuid, data: UpdateCluster) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _cluster_statement = diesel::update(dsl::clusters.find(cluster_id))
            .set(&data)
            .get_result::<Cluster>(&mut conn)?;

        Ok(())
    }

    pub fn delete_cluster(&self, cluster_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::clusters.find(cluster_id))
            .execute(&mut conn)
            .expect("Error deleting cluster");
        Ok(())
    }
}

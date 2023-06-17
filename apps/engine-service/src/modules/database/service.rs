use crate::extras::types::Error;
use crate::schema::databases::{self, dsl};
use crate::state::DbPool;
use diesel::prelude::*;
use uuid::Uuid;
use super::model::{Database, NewDatabase, UpdateDatabase};

#[derive(Clone)]
pub struct DatabaseService {
    pub pool: DbPool,
}

impl DatabaseService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }
    pub fn get_database(&self, database_id: Uuid) -> Result<Database, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: Database = dsl::databases.find(database_id).first(&mut conn)?;
        Ok(results)
    }

    pub fn get_databases(
        &self,
        workspace_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<Database>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };
        let results: Vec<Database> = dsl::databases
            .filter(dsl::workspace_id.eq(workspace_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;
        Ok(results)
    }

    
    pub fn create_database(
        &self,
        data: NewDatabase,
    ) -> Result<Database, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: Database = diesel::insert_into(databases::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new database");

        Ok(results)
    }

    pub fn update_database(
        &self,
        database_id: Uuid,
        data: UpdateDatabase,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _database_statement = diesel::update(dsl::databases.find(database_id))
            .set(&data)
            .get_result::<Database>(&mut conn)?;

        Ok(())
    }

    pub fn delete_database(&self, database_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::databases.find(database_id))
            .execute(&mut conn)
            .expect("Error deleting database");
        Ok(())
    }
}



use crate::extras::types::Error;
use crate::schema::tables::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*};
use uuid::Uuid;

use super::model::{DatabaseTable, NewDatabaseTable, UpdateDatabaseTable};

#[derive(Clone)]
pub struct DatabaseTableService {
    pub pool: DbPool,
}

impl DatabaseTableService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_database_table(
        &self,
        table_id: Uuid,
    ) -> Result<DatabaseTable, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: DatabaseTable = dsl::tables
            .find(table_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_database_tables(
        &self,
        database_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<DatabaseTable>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results: Vec<DatabaseTable> = dsl::tables
            .filter(dsl::database_id.eq(database_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;
        Ok(results)
    }

    pub fn create_database_table(
        &self,
        data: NewDatabaseTable,
    ) -> Result<DatabaseTable, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: DatabaseTable = diesel::insert_into(tables::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new Databasetables");
        Ok(results)
    }

    pub fn update_database_table(
        &self,
        table_id: Uuid,
        data: UpdateDatabaseTable,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _tables_statement =
            diesel::update(dsl::tables.find(table_id))
                .set(&data)
                .get_result::<DatabaseTable>(&mut conn)?;

        Ok(())
    }

    pub fn delete_database_table(&self, table_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::tables.find(table_id))
            .execute(&mut conn)
            .expect("Error deleting tables");
        Ok(())
    }
}

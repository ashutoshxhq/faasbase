use crate::extras::types::Error;
use crate::schema::fields::{self, dsl};
use crate::state::DbPool;
use diesel::{prelude::*};
use uuid::Uuid;

use super::model::{DatabaseTableField, NewDatabaseTableField, UpdateDatabaseTableField};

#[derive(Clone)]
pub struct DatabaseTableFieldService {
    pub pool: DbPool,
}

impl DatabaseTableFieldService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_database_table_field(
        &self,
        field_id: Uuid,
    ) -> Result<DatabaseTableField, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: DatabaseTableField = dsl::fields
            .find(field_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_database_table_fields(
        &self,
        table_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<DatabaseTableField>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results: Vec<DatabaseTableField> = dsl::fields
            .filter(dsl::database_id.eq(table_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;
        Ok(results)
    }

    pub fn create_database_table_field(
        &self,
        data: NewDatabaseTableField,
    ) -> Result<DatabaseTableField, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: DatabaseTableField = diesel::insert_into(fields::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new DatabasetableFields");
        Ok(results)
    }

    pub fn update_database_table_field(
        &self,
        field_id: Uuid,
        data: UpdateDatabaseTableField,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _tables_statement =
            diesel::update(dsl::fields.find(field_id))
                .set(&data)
                .get_result::<DatabaseTableField>(&mut conn)?;

        Ok(())
    }

    pub fn delete_database_table_field(&self, field_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::fields.find(field_id))
            .execute(&mut conn)
            .expect("Error deleting tables");
        Ok(())
    }
}

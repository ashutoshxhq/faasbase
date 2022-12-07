use crate::extras::types::Error;
use crate::schema::application_logs::{self, dsl};
use crate::state::DbPool;
use diesel::prelude::*;
use uuid::Uuid;

use super::model::{ApplicationLog, NewApplicationLog, UpdateApplicationLog};

#[derive(Clone)]
pub struct ApplicationLogService {
    pub pool: DbPool,
}

impl ApplicationLogService {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn get_application_log(&self, application_logs_id: Uuid) -> Result<ApplicationLog, Error> {
        let mut conn = self.pool.clone().get()?;
        let results: ApplicationLog = dsl::application_logs
            .find(application_logs_id)
            .first(&mut conn)?;
        Ok(results)
    }

    pub fn get_application_logs(
        &self,
        application_id: Uuid,
        offset: Option<i64>,
        limit: Option<i64>,
    ) -> Result<Vec<ApplicationLog>, Error> {
        let mut conn = self.pool.clone().get()?;
        let offset = if let Some(offset) = offset { offset } else { 0 };
        let limit = if let Some(limit) = limit { limit } else { 10 };

        let results: Vec<ApplicationLog> = dsl::application_logs
            .filter(dsl::application_id.eq(application_id))
            .offset(offset)
            .limit(limit)
            .load(&mut conn)?;
        Ok(results)
    }

    pub fn create_application_log(&self, data: NewApplicationLog) -> Result<ApplicationLog, Error> {
        let mut conn = self.pool.clone().get()?;

        let results: ApplicationLog = diesel::insert_into(application_logs::table)
            .values(&data)
            .get_result(&mut conn)
            .expect("Error saving new application_logs");
        Ok(results)
    }

    pub fn update_application_log(
        &self,
        application_logs_id: Uuid,
        data: UpdateApplicationLog,
    ) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;
        let _application_logs_statement =
            diesel::update(dsl::application_logs.find(application_logs_id))
                .set(&data)
                .get_result::<ApplicationLog>(&mut conn)?;

        Ok(())
    }

    pub fn delete_application_log(&self, application_logs_id: Uuid) -> Result<(), Error> {
        let mut conn = self.pool.clone().get()?;

        diesel::delete(dsl::application_logs.find(application_logs_id))
            .execute(&mut conn)
            .expect("Error deleting application_logs");
        Ok(())
    }
}

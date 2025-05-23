use diesel::{
    r2d2::{self, ConnectionManager, Pool},
    PgConnection,
};

use crate::modules::service::FaasbaseService;

pub type DbPool = Pool<ConnectionManager<PgConnection>>;

#[derive(Clone)]
pub struct FaasbaseState {
    pub services: FaasbaseService,
}

impl FaasbaseState {
    pub fn new() -> Self {
        let manager = ConnectionManager::<PgConnection>::new(
            std::env::var("DATABASE_URL").expect("Unable to get database url"),
        );
        let pool = r2d2::Pool::builder()
            .max_size(10)
            .min_idle(Some(1))
            .test_on_check_out(true)
            .build(manager)
            .unwrap();

        Self {
            services: FaasbaseService::new(pool)
        }
    }
}

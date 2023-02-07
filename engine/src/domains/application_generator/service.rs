use crate::{extras::types::Error, domains::application_build::model::ApplicationBuildContext};

#[derive(Clone)]
pub struct ApplicationGeneratorService {}

impl ApplicationGeneratorService {
    pub fn new() -> Self {
        Self {}
    }

    pub fn generate_application(&self, context: ApplicationBuildContext) -> Result<(), Error> {
        Ok(())
    }

    pub fn generate_rust_application(&self, context: ApplicationBuildContext) -> Result<(), Error> {
        Ok(())
    }
}
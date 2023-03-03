use axum::Router;
use super::{
    application, application_build, application_collaborator, application_log,
    application_resource, cluster, function, function_build, function_collaborator, workspaces,
    workspace_audit_logs, workspace_members, user, authn, database, database_table, database_table_field, workers, health
};

pub fn router() -> Router {
    Router::new()
        .merge(authn::router())
        .merge(user::router())
        .merge(workspaces::router())
        .merge(workspace_audit_logs::router())
        .merge(workspace_members::router())
        .merge(function::router())
        .merge(function_build::router())
        .merge(function_collaborator::router())
        .merge(cluster::router())
        .merge(application::router())
        .merge(application_build::router())
        .merge(application_collaborator::router())
        .merge(application_log::router())
        .merge(application_resource::router())
        .merge(database::router())
        .merge(database_table::router())
        .merge(database_table_field::router())
        .merge(workers::router())
        .merge(health::router())
}

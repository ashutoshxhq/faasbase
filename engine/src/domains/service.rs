use super::{
    function::service::FunctionService, function_build::service::FunctionBuildService,
    function_collaborator::service::FunctionCollaboratorService,
    workspaces::service::WorkspaceService, workspace_audit_logs::service::AuditLogService,
    workspace_members::service::WorkspaceMemberService, user::service::UserService, cluster::service::ClusterService, application::service::ApplicationService, application_build::service::ApplicationBuildService, application_collaborator::service::ApplicationCollaboratorService, application_log::service::ApplicationLogService, application_resource::service::ApplicationResourceService, authn::service::AuthNService, database::service::DatabaseService, database_table::service::DatabaseTableService, database_table_field::{model::DatabaseTableField, service::DatabaseTableFieldService},
};
use crate::state::DbPool;

#[derive(Clone)]
pub struct FaaslyService {
    pub authn: AuthNService,
    pub user: UserService,
    pub workspace: WorkspaceService,
    pub workspace_member: WorkspaceMemberService,
    pub audit_log: AuditLogService,
    pub function: FunctionService,
    pub function_build: FunctionBuildService,
    pub function_collaborator: FunctionCollaboratorService,
    pub cluster: ClusterService,
    pub application: ApplicationService,
    pub application_build: ApplicationBuildService,
    pub application_collaborator: ApplicationCollaboratorService,
    pub application_log: ApplicationLogService,
    pub application_resource: ApplicationResourceService,
    pub databases: DatabaseService,
    pub tables: DatabaseTableService,
    pub fields: DatabaseTableFieldService
}

impl FaaslyService {
    pub fn new(pool: DbPool) -> Self {
        Self {
            authn: AuthNService::new(pool.clone()),
            user: UserService::new(pool.clone()),
            workspace: WorkspaceService::new(pool.clone()),
            workspace_member: WorkspaceMemberService::new(pool.clone()),
            audit_log: AuditLogService::new(pool.clone()),
            function: FunctionService::new(pool.clone()),
            function_build: FunctionBuildService::new(pool.clone()),
            function_collaborator: FunctionCollaboratorService::new(pool.clone()),
            cluster: ClusterService::new(pool.clone()),
            application: ApplicationService::new(pool.clone()),
            application_build: ApplicationBuildService::new(pool.clone()),
            application_collaborator: ApplicationCollaboratorService::new(pool.clone()),
            application_log: ApplicationLogService::new(pool.clone()),
            application_resource: ApplicationResourceService::new(pool.clone()),
            databases: DatabaseService::new(pool.clone()),
            tables: DatabaseTableService::new(pool.clone()),
            fields: DatabaseTableFieldService::new(pool.clone())
        }
    }
}

// @generated automatically by Diesel CLI.

diesel::table! {
    application_builds (id) {
        id -> Uuid,
        version -> Varchar,
        changelog -> Nullable<Text>,
        config -> Nullable<Jsonb>,
        application_id -> Uuid,
        user_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    application_collaborators (id) {
        id -> Uuid,
        permission -> Varchar,
        application_id -> Uuid,
        collaborator_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    application_forks (id) {
        id -> Uuid,
        application_id -> Uuid,
        user_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    application_logs (id) {
        id -> Uuid,
        log_type -> Varchar,
        application_id -> Uuid,
        resource_type -> Varchar,
        resource_id -> Uuid,
        data -> Jsonb,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    application_resources (id) {
        id -> Uuid,
        resource_type -> Varchar,
        config -> Nullable<Jsonb>,
        resource_id -> Nullable<Uuid>,
        application_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    application_stars (id) {
        id -> Uuid,
        application_id -> Uuid,
        user_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    applications (id) {
        id -> Uuid,
        name -> Varchar,
        application_type -> Text,
        description -> Nullable<Text>,
        readme -> Nullable<Text>,
        visibility -> Varchar,
        repository -> Nullable<Varchar>,
        website -> Nullable<Varchar>,
        latest_version -> Nullable<Varchar>,
        size -> Nullable<Varchar>,
        config -> Nullable<Jsonb>,
        variables -> Nullable<Jsonb>,
        user_id -> Nullable<Uuid>,
        workspace_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    audit_logs (id) {
        id -> Uuid,
        resource_type -> Varchar,
        resource_id -> Uuid,
        action_type -> Varchar,
        actor_id -> Uuid,
        workspace_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    clusters (id) {
        id -> Uuid,
        name -> Varchar,
        provider -> Varchar,
        provider_config -> Jsonb,
        cluster_config -> Varchar,
        user_id -> Nullable<Uuid>,
        workspace_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    databases (id) {
        id -> Uuid,
        name -> Varchar,
        hostname -> Varchar,
        username -> Varchar,
        password -> Varchar,
        port -> Varchar,
        database_type -> Varchar,
        user_id -> Uuid,
        workspace_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    fields (id) {
        id -> Uuid,
        data_type -> Varchar,
        visibility -> Varchar,
        default_value -> Nullable<Varchar>,
        relationship_config -> Nullable<Jsonb>,
        user_id -> Uuid,
        table_id -> Uuid,
        database_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    function_builds (id) {
        id -> Uuid,
        version -> Varchar,
        changelog -> Nullable<Text>,
        config -> Nullable<Jsonb>,
        function_id -> Uuid,
        user_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    function_collaborators (id) {
        id -> Uuid,
        permission -> Varchar,
        function_id -> Uuid,
        collaborator_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    function_forks (id) {
        id -> Uuid,
        function_id -> Uuid,
        user_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    function_stars (id) {
        id -> Uuid,
        function_id -> Uuid,
        user_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    functions (id) {
        id -> Uuid,
        name -> Varchar,
        description -> Nullable<Text>,
        readme -> Nullable<Text>,
        repository -> Nullable<Varchar>,
        visibility -> Varchar,
        website -> Nullable<Varchar>,
        size -> Nullable<Varchar>,
        latest_version -> Nullable<Varchar>,
        user_id -> Nullable<Uuid>,
        workspace_id -> Nullable<Uuid>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    tables (id) {
        id -> Uuid,
        name -> Varchar,
        description -> Nullable<Text>,
        readme -> Nullable<Text>,
        user_id -> Uuid,
        database_id -> Uuid,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    users (id) {
        id -> Uuid,
        firstname -> Nullable<Varchar>,
        lastname -> Nullable<Varchar>,
        email -> Nullable<Varchar>,
        username -> Nullable<Varchar>,
        connection -> Nullable<Varchar>,
        idp_user_id -> Varchar,
        profile_pic -> Nullable<Varchar>,
        readme -> Nullable<Text>,
        timezone -> Nullable<Varchar>,
        metadata -> Nullable<Jsonb>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    workspace_members (id) {
        id -> Uuid,
        user_id -> Uuid,
        workspace_id -> Uuid,
        role -> Varchar,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    workspaces (id) {
        id -> Uuid,
        name -> Varchar,
        description -> Nullable<Varchar>,
        website -> Nullable<Varchar>,
        email -> Nullable<Varchar>,
        readme -> Nullable<Text>,
        twitter -> Nullable<Varchar>,
        location -> Nullable<Varchar>,
        created_at -> Nullable<Timestamp>,
        updated_at -> Nullable<Timestamp>,
        deleted_at -> Nullable<Timestamp>,
    }
}

diesel::joinable!(application_builds -> applications (application_id));
diesel::joinable!(application_builds -> users (user_id));
diesel::joinable!(application_collaborators -> applications (application_id));
diesel::joinable!(application_collaborators -> users (collaborator_id));
diesel::joinable!(application_forks -> applications (application_id));
diesel::joinable!(application_forks -> users (user_id));
diesel::joinable!(application_logs -> applications (application_id));
diesel::joinable!(application_resources -> applications (application_id));
diesel::joinable!(application_stars -> applications (application_id));
diesel::joinable!(application_stars -> users (user_id));
diesel::joinable!(applications -> users (user_id));
diesel::joinable!(applications -> workspaces (workspace_id));
diesel::joinable!(audit_logs -> users (actor_id));
diesel::joinable!(audit_logs -> workspaces (workspace_id));
diesel::joinable!(clusters -> users (user_id));
diesel::joinable!(clusters -> workspaces (workspace_id));
diesel::joinable!(databases -> users (user_id));
diesel::joinable!(databases -> workspaces (workspace_id));
diesel::joinable!(fields -> databases (database_id));
diesel::joinable!(fields -> tables (table_id));
diesel::joinable!(fields -> users (user_id));
diesel::joinable!(function_builds -> functions (function_id));
diesel::joinable!(function_builds -> users (user_id));
diesel::joinable!(function_collaborators -> functions (function_id));
diesel::joinable!(function_collaborators -> users (collaborator_id));
diesel::joinable!(function_forks -> functions (function_id));
diesel::joinable!(function_forks -> users (user_id));
diesel::joinable!(function_stars -> functions (function_id));
diesel::joinable!(function_stars -> users (user_id));
diesel::joinable!(functions -> users (user_id));
diesel::joinable!(functions -> workspaces (workspace_id));
diesel::joinable!(tables -> databases (database_id));
diesel::joinable!(tables -> users (user_id));
diesel::joinable!(workspace_members -> users (user_id));
diesel::joinable!(workspace_members -> workspaces (workspace_id));

diesel::allow_tables_to_appear_in_same_query!(
    application_builds,
    application_collaborators,
    application_forks,
    application_logs,
    application_resources,
    application_stars,
    applications,
    audit_logs,
    clusters,
    databases,
    fields,
    function_builds,
    function_collaborators,
    function_forks,
    function_stars,
    functions,
    tables,
    users,
    workspace_members,
    workspaces,
);

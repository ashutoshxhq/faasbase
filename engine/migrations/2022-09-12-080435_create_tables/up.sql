-- Your SQL goes here
create table users (
    id uuid default uuid_generate_v4() not null primary key,
    firstname varchar,
    lastname varchar,
    email varchar,
    username varchar,
    connection varchar,
    idp_user_id varchar not null,
    profile_pic varchar,
    readme text,
    timezone varchar,
    metadata jsonb,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table workspaces (
    id uuid default uuid_generate_v4() not null primary key,
    name varchar not null,
    description varchar,
    website varchar,
    email varchar,
    readme text,
    twitter varchar,
    location varchar,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table workspace_members (
    id uuid default uuid_generate_v4() not null primary key,
    user_id uuid not null references users,
    workspace_id uuid not null references workspaces ON DELETE CASCADE,
    role varchar not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table applications (
    id uuid default uuid_generate_v4() not null primary key,
    name varchar not null,
    application_type text not null,
    description text,
    readme text,
    visibility varchar not null,
    repository varchar,
    website varchar,
    latest_version varchar,
    size varchar,
    config jsonb,
    variables jsonb,
    user_id uuid references users,
    workspace_id uuid references workspaces ON DELETE CASCADE,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_builds (
    id uuid default uuid_generate_v4() not null primary key,
    version varchar not null,
    changelog text,
    config jsonb,
    application_id uuid not null references applications,
    user_id uuid references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_resources (
    id uuid default uuid_generate_v4() not null primary key,
    resource_type varchar not null,
    config jsonb,
    resource_id uuid,
    application_id uuid not null references applications,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_logs (
    id uuid default uuid_generate_v4() not null primary key,
    log_type varchar not null,
    application_id uuid not null references applications,
    resource_type varchar not null,
    resource_id uuid not null,
    data jsonb not null,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_collaborators (
    id uuid default uuid_generate_v4() not null primary key,
    permission varchar not null,
    application_id uuid not null references applications,
    collaborator_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_stars (
    id uuid default uuid_generate_v4() not null primary key,
    application_id uuid not null references applications,
    user_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table application_forks (
    id uuid default uuid_generate_v4() not null primary key,
    application_id uuid not null references applications,
    user_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table functions (
    id uuid default uuid_generate_v4() not null primary key,
    name varchar not null,
    description text,
    readme text,
    repository varchar,
    visibility varchar not null,
    website varchar,
    size varchar,
    latest_version varchar,
    user_id uuid references users,
    workspace_id uuid references workspaces ON DELETE CASCADE,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table function_builds (
    id uuid default uuid_generate_v4() not null primary key,
    version varchar not null,
    changelog text,
    config jsonb,
    function_id uuid not null references functions,
    user_id uuid references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table function_collaborators (
    id uuid default uuid_generate_v4() not null primary key,
    permission varchar not null,
    function_id uuid not null references functions,
    collaborator_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table function_stars (
    id uuid default uuid_generate_v4() not null primary key,
    function_id uuid not null references functions,
    user_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table function_forks (
    id uuid default uuid_generate_v4() not null primary key,
    function_id uuid not null references functions,
    user_id uuid not null references users,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table clusters (
    id uuid default uuid_generate_v4() not null primary key,
    name varchar not null,
    provider varchar not null,
    provider_config jsonb not null,
    cluster_config varchar not null,
    user_id uuid references users,
    workspace_id uuid constraint clusters_workspaces_null_fk references workspaces ON DELETE CASCADE,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);

create table audit_logs (
    id uuid default uuid_generate_v4() not null primary key,
    resource_type varchar not null,
    resource_id uuid not null,
    action_type varchar not null,
    actor_id uuid not null references users,
    workspace_id uuid not null references workspaces ON DELETE CASCADE,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP,
    deleted_at timestamp
);
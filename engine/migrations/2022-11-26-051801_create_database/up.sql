-- Your SQL goes here

create table databases (
  id uuid default uuid_generate_v4() not null primary key,
  name varchar not null,
  hostname varchar not null,
  username varchar not null,
  password varchar not null,
  port varchar not null,
  database_type varchar not null,
  user_id uuid not null references users,
  workspace_id uuid not null references workspaces ON DELETE CASCADE,
  created_at timestamp default CURRENT_TIMESTAMP,
  updated_at timestamp default CURRENT_TIMESTAMP,
  deleted_at timestamp
);

create table tables (
  id uuid default uuid_generate_v4() not null primary key,
  name varchar not null,
  description text,
  readme text,
  user_id uuid not null references users,
  database_id uuid not null references databases ON DELETE CASCADE,
  created_at timestamp default CURRENT_TIMESTAMP,
  updated_at timestamp default CURRENT_TIMESTAMP,
  deleted_at timestamp
);

create table fields (
  id uuid default uuid_generate_v4() not null primary key,
  data_type varchar not null,
  visibility varchar not null,
  default_value varchar,
  relationship_config jsonb,
  user_id uuid not null references users,
  table_id uuid not null references tables ON DELETE CASCADE,
  database_id uuid not null references databases ON DELETE CASCADE,
  created_at timestamp default CURRENT_TIMESTAMP,
  updated_at timestamp default CURRENT_TIMESTAMP,
  deleted_at timestamp
);
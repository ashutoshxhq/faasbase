-- Your SQL goes here
ALTER TABLE application_builds
ADD built_at timestamp;

ALTER TABLE application_builds
ADD deployed_at timestamp;
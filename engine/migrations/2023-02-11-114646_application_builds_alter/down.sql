-- This file should undo anything in `up.sql`
ALTER TABLE application_builds
DROP COLUMN build_status;

ALTER TABLE application_builds
DROP COLUMN deployment_status;

ALTER TABLE application_builds
DROP COLUMN logs;
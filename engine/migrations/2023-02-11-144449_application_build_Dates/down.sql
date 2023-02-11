-- This file should undo anything in `up.sql`
ALTER TABLE application_builds
DROP COLUMN built_at;

ALTER TABLE application_builds
DROP COLUMN deployed_at;
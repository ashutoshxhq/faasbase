-- This file should undo anything in `up.sql`
ALTER TABLE applications
RENAME COLUMN deployed_version to latest_version;
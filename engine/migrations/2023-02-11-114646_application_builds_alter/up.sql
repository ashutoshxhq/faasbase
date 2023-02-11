-- Your SQL goes here
ALTER TABLE application_builds
ADD build_status varchar default 'BUILDING';

ALTER TABLE application_builds
ADD deployment_status varchar default 'NOT_STARTED';

ALTER TABLE application_builds
ADD logs jsonb;
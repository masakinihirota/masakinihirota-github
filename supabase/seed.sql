-- Seed file (supabase/seed.sql)
-- This file contains idempotent seed SQL suitable for use with the Supabase CLI
-- (https://supabase.com/docs/guides/local-development/seeding-your-database).
-- Execute with: supabase db seed --file ./supabase/seed.sql

\echo 'Seeding: 01_reference.sql'
\i ./seed/01_reference.sql

\echo 'Seeding: 02_users_root_accounts.sql'
\i ./seed/02_users_root_accounts.sql

\echo 'Seeding: 03_profiles.sql'
\i ./seed/03_profiles.sql

\echo 'Seeding: 04_works.sql'
\i ./seed/04_works.sql

\echo 'Seeding: 05_profile_works.sql'
\i ./seed/05_profile_works.sql

\echo 'Seeding: 06_points.sql'
\i ./seed/06_points.sql

\echo 'Seeding: 07_achievements.sql'
\i ./seed/07_achievements.sql

\echo 'Seeding: 08_skills.sql'
\i ./seed/08_skills.sql

\echo 'Seeding: 09_relations.sql'
\i ./seed/09_relations.sql

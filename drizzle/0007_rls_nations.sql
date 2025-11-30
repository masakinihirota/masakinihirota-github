-- 0007_rls_nations.sql
-- Add helper and RLS policy for `nations` table

-- function: has_nation_role(profile_id uuid, nation_id uuid, role_key text)
CREATE OR REPLACE FUNCTION has_nation_role(p_profile_id uuid, p_nation_id uuid, p_role_key text)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS(
    SELECT 1 FROM acl_nation_role_assignments a
    WHERE a.profile_id = p_profile_id AND a.nation_id = p_nation_id AND a.role_id = p_role_key
  );
$$;

-- Enable RLS on nations and add a policy for SELECT that permits:
--  - system roles (current_roles contains 'sys_admin')
--  - profiles having nation_role 'nation_leader' for that nation

ALTER TABLE nations ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies with same name to make migrations idempotent in dev/test
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'nations_select_policy') THEN
    EXECUTE 'DROP POLICY nations_select_policy ON nations';
  END IF;
END$$;

CREATE POLICY nations_select_policy ON nations FOR SELECT USING (
  (
    -- sys_admin membership check: expect app.current_roles to be a JSON array string like '["sys_admin","role2"]'
    COALESCE(current_setting('app.current_roles', true), '[]')::jsonb @> '"sys_admin"'::jsonb
  )
  OR
  (
    -- current user (profile) has the nation leader logical role for this nation
    current_setting('app.current_profile_id', true) IS NOT NULL
    AND has_nation_role(current_setting('app.current_profile_id', true)::uuid, id, 'nation_leader')
  )
);

-- Secure write policies: allow only sys_admin to create/update/delete nations.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'nations_write_insert') THEN
    EXECUTE 'DROP POLICY nations_write_insert ON nations';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'nations_write_update') THEN
    EXECUTE 'DROP POLICY nations_write_update ON nations';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE polname = 'nations_write_delete') THEN
    EXECUTE 'DROP POLICY nations_write_delete ON nations';
  END IF;
END$$;

CREATE POLICY nations_write_insert ON nations FOR INSERT WITH CHECK (
  COALESCE(current_setting('app.current_roles', true), '[]')::jsonb @> '"sys_admin"'::jsonb
);

CREATE POLICY nations_write_update ON nations FOR UPDATE USING (
  COALESCE(current_setting('app.current_roles', true), '[]')::jsonb @> '"sys_admin"'::jsonb
) WITH CHECK (
  COALESCE(current_setting('app.current_roles', true), '[]')::jsonb @> '"sys_admin"'::jsonb
);

CREATE POLICY nations_write_delete ON nations FOR DELETE USING (
  COALESCE(current_setting('app.current_roles', true), '[]')::jsonb @> '"sys_admin"'::jsonb
);

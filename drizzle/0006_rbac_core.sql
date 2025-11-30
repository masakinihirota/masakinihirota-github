-- 0006_rbac_core.sql
-- Add user_authorization_permissions cache / user_context_roles / role_assignment_history

CREATE TABLE IF NOT EXISTS user_context_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  context_type text NOT NULL, -- 'nation' | 'organization'
  context_id uuid NOT NULL,
  role_key text NOT NULL,
  valid_from timestamptz,
  valid_to timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_context_roles_user_id ON user_context_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_context_roles_context ON user_context_roles(context_type, context_id);

CREATE TABLE IF NOT EXISTS role_assignment_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role_key text NOT NULL,
  operation text NOT NULL, -- assign|revoke
  operator_id uuid,
  reason text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_assignment_history_user_id ON role_assignment_history(user_id);

CREATE TABLE IF NOT EXISTS user_authorization_permissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  resource_id uuid,
  resource_type text,
  action text NOT NULL,
  allowed boolean NOT NULL,
  context_id uuid,
  expires_at timestamptz,
  computed_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_auth_perms_user_id ON user_authorization_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_auth_perms_resource ON user_authorization_permissions(resource_type, resource_id);

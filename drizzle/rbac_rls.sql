-- Enable RLS
ALTER TABLE acl_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE acl_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE acl_role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_context_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_authorization_permissions ENABLE ROW LEVEL SECURITY;

-- Policies

-- acl_permissions: Public Read, Admin Write (assuming service_role for write)
CREATE POLICY "Allow public read access" ON acl_permissions FOR SELECT USING (true);

-- acl_roles: Public Read
CREATE POLICY "Allow public read access" ON acl_roles FOR SELECT USING (true);

-- acl_role_permissions: Public Read
CREATE POLICY "Allow public read access" ON acl_role_permissions FOR SELECT USING (true);

-- user_context_roles: Users can read their own roles
CREATE POLICY "Users can read own context roles" ON user_context_roles
  FOR SELECT USING (auth.uid() = user_id);

-- user_authorization_permissions: Users can read their own permissions
CREATE POLICY "Users can read own auth permissions" ON user_authorization_permissions
  FOR SELECT USING (auth.uid() = user_id);

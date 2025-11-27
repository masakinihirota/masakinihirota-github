-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_root_accounts_updated_at BEFORE UPDATE ON root_accounts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_nations_updated_at BEFORE UPDATE ON nations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auth Sync Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email)
  ON CONFLICT (id) DO UPDATE SET email = new.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (Commented out to avoid permission issues if running as non-superuser, but recommended to run manually or via Supabase dashboard if migration fails)
-- Trigger on auth.users
-- IMPORTANT: This trigger cannot be created via Drizzle migration due to permissions on the auth schema.
-- Please execute the following SQL manually in the Supabase Dashboard SQL Editor:
--
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

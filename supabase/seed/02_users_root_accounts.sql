-- 02_users_root_accounts.sql
-- Create sample auth users and corresponding root_accounts

-- NOTE: For local dev we insert into public.users for convenience; production auth sync is handled via triggers
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001','alice@example.com', now(), now()),
  ('00000000-0000-0000-0000-000000000002','bob@example.com', now(), now())
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

INSERT INTO public.root_accounts (id, user_id, display_name, location, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'アリス', '地球 / 日本', now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'ボブ', '地球 / 欧州', now(), now())
ON CONFLICT (id) DO NOTHING;

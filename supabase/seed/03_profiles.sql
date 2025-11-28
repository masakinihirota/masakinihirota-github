-- 03_profiles.sql
-- Create sample profiles linked to root accounts

INSERT INTO public.profiles (id, root_account_id, name, bio, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'アリスのプロフィール1', '本や音楽が好きです。', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'ボブのプロフィール1', 'ゲーム開発と映画が好きです。', now(), now())
ON CONFLICT (id) DO NOTHING;

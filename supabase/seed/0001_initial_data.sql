-- 0001_initial_data.sql
-- Supabase-friendly seed data for new tables and some example rows
-- Run this in Supabase SQL editor or your dev DB. Use idempotent INSERTs.

-- sample users
INSERT INTO public.users (id, email, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001','alice@example.com', now(), now()),
  ('00000000-0000-0000-0000-000000000002','bob@example.com', now(), now())
ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

-- root accounts
INSERT INTO public.root_accounts (id, user_id, display_name, location, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'AliceRoot', 'Earth / JP', now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'BobRoot', 'Earth / EU', now(), now())
ON CONFLICT (id) DO NOTHING;

-- profiles
INSERT INTO public.profiles (id, root_account_id, name, bio, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'AliceProfile1', 'I love books and music', now(), now()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'BobProfile1', 'Game dev & film', now(), now())
ON CONFLICT (id) DO NOTHING;

-- make sure categories and roles exist (idempotent)
INSERT INTO work_categories (id, name) VALUES ('Book','Book'), ('Movie','Movie'), ('Game','Game') ON CONFLICT (id) DO NOTHING;
INSERT INTO value_categories (id, name) VALUES ('Personal','Personal'), ('Social','Social'), ('Professional','Professional') ON CONFLICT (id) DO NOTHING;
INSERT INTO organization_roles (id, name) VALUES ('leader','Leader'),('member','Member') ON CONFLICT (id) DO NOTHING;
INSERT INTO nation_levels (id, name) VALUES ('Village','Village'),('Town','Town') ON CONFLICT (id) DO NOTHING;

-- sample works
INSERT INTO public.works (id, title, category_id, description, authors, release_year, genres, intro_url, affiliate_url, size, approved)
VALUES
 ('30000000-0000-0000-0000-000000000001','The Early Book','Book','A short novel about things', '[{"name":"Author A"}]'::jsonb, 2020, '["Fiction","Fantasy"]'::jsonb, 'https://example.com/book1','', 'short', true),
 ('30000000-0000-0000-0000-000000000002','Indie Game','Game','A fun indie game', '[{"name":"Dev Studio"}]'::jsonb, 2023, '["Indie","Adventure"]'::jsonb, 'https://example.com/game', '', 'medium', true)
ON CONFLICT (id) DO NOTHING;

-- profile -> works ratings
INSERT INTO public.profile_works (profile_id, work_id, status, tier, claps, liked, created_at)
VALUES
 ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'life', 1, 5, true, now()),
 ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'now', 2, 2, false, now())
ON CONFLICT (profile_id, work_id) DO NOTHING;

-- points ledger and transactions
INSERT INTO public.root_account_points (root_account_id, balance, last_updated)
VALUES
 ('10000000-0000-0000-0000-000000000001', 3000, now()),
 ('10000000-0000-0000-0000-000000000002', 2000, now())
ON CONFLICT (root_account_id) DO UPDATE SET balance = EXCLUDED.balance;

INSERT INTO public.point_transactions (id, root_account_id, delta, reason, related_entity, related_id, created_at)
VALUES
 (gen_random_uuid(),'10000000-0000-0000-0000-000000000001',3000,'onboarding bonus','system',NULL, now()),
 (gen_random_uuid(),'10000000-0000-0000-0000-000000000002',2000,'reset seed','system',NULL, now())
ON CONFLICT (id) DO NOTHING;

-- achievements
INSERT INTO public.achievements (id, name, description, points) VALUES
  ('40000000-0000-0000-0000-000000000001','初陣','初組織作成',100),
  ('40000000-0000-0000-0000-000000000002','人気者','メンバー10人達成',300)
ON CONFLICT (id) DO NOTHING;

-- grant achievement to Alice
INSERT INTO public.root_account_achievements (id, root_account_id, achievement_id, awarded_at)
VALUES (gen_random_uuid(),'10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001', now()) ON CONFLICT DO NOTHING;

-- skills
INSERT INTO public.skills (id, name, description) VALUES
 ('50000000-0000-0000-0000-000000000001','JavaScript','Frontend dev'),
 ('50000000-0000-0000-0000-000000000002','Writing','Creative writing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profile_skills (profile_id, skill_id, level) VALUES
 ('20000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002', 3),
 ('20000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000001', 4)
ON CONFLICT DO NOTHING;

-- follows
INSERT INTO public.follows (follower_profile_id, target_profile_id, created_at) VALUES
 ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002', now()) ON CONFLICT DO NOTHING;

-- match history
INSERT INTO public.match_history (id, profile_id, matched_profile_id, score, matched_at) VALUES
 (gen_random_uuid(), '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 0.87, now()) ON CONFLICT DO NOTHING;

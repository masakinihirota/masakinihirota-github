-- 07_achievements.sql
-- Achievements master data and assignments

INSERT INTO public.achievements (id, name, description, points) VALUES
  ('40000000-0000-0000-0000-000000000001','初陣','初組織作成',100),
  ('40000000-0000-0000-0000-000000000002','人気者','メンバー10人達成',300)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.root_account_achievements (id, root_account_id, achievement_id, awarded_at)
VALUES (gen_random_uuid(),'10000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000001', now())
ON CONFLICT DO NOTHING;

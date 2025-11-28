-- 05_profile_works.sql
-- Link profiles to works and provide ratings / state

INSERT INTO public.profile_works (profile_id, work_id, status, tier, claps, liked, created_at)
VALUES
 ('20000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'life', 1, 5, true, now()),
 ('20000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'now', 2, 2, false, now())
ON CONFLICT (profile_id, work_id) DO NOTHING;

-- 09_relations.sql
-- Follows and match_history fixtures

INSERT INTO public.follows (follower_profile_id, target_profile_id, created_at) VALUES
 ('20000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000002', now()) ON CONFLICT DO NOTHING;

INSERT INTO public.match_history (id, profile_id, matched_profile_id, score, matched_at) VALUES
 (gen_random_uuid(), '20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 0.87, now()) ON CONFLICT DO NOTHING;

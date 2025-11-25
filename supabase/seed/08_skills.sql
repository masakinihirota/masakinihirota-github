-- 08_skills.sql
-- Skills master and profile-skill relations

INSERT INTO public.skills (id, name, description) VALUES
 ('50000000-0000-0000-0000-000000000001','JavaScript（フロントエンド）','フロントエンド開発'),
 ('50000000-0000-0000-0000-000000000002','ライティング','クリエイティブライティング')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profile_skills (profile_id, skill_id, level) VALUES
 ('20000000-0000-0000-0000-000000000001','50000000-0000-0000-0000-000000000002', 3),
 ('20000000-0000-0000-0000-000000000002','50000000-0000-0000-0000-000000000001', 4)
ON CONFLICT DO NOTHING;

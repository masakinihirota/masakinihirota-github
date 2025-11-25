-- 06_points.sql
-- Points ledger and sample transactions

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

-- Task 9.1: ポイント徴収フロー (FR-130-003)
-- 猶予期間開始日カラムを追加

ALTER TABLE "topdown_nations" ADD COLUMN IF NOT EXISTS "grace_period_start_date" timestamptz;

COMMENT ON COLUMN "topdown_nations"."grace_period_start_date" IS '維持費徴収失敗時の猶予期間開始日。30日間の猶予期間中は国が活動可能。';

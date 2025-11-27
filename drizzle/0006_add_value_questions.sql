ALTER TABLE "value_categories" ADD COLUMN IF NOT EXISTS "question" text;
ALTER TABLE "value_categories" ADD COLUMN IF NOT EXISTS "description" text;

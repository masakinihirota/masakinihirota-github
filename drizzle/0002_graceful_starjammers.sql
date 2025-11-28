ALTER TABLE "nations" DROP CONSTRAINT "nations_leader_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organizations" DROP CONSTRAINT "organizations_leader_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "nations" ALTER COLUMN "leader_organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "leader_profile_id" DROP NOT NULL;--> statement-breakpoint
-- Ensure 'Uncategorized' exists in value_categories
INSERT INTO "value_categories" ("id", "name") VALUES ('Uncategorized', 'Uncategorized') ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
-- Update existing NULL category_id to 'Uncategorized'
UPDATE "value_definitions" SET "category_id" = 'Uncategorized' WHERE "category_id" IS NULL;
--> statement-breakpoint
ALTER TABLE "value_definitions" ALTER COLUMN "category_id" SET DEFAULT 'Uncategorized';--> statement-breakpoint
ALTER TABLE "value_definitions" ALTER COLUMN "category_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_leader_organization_id_organizations_id_fk" FOREIGN KEY ("leader_organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_leader_profile_id_profiles_id_fk" FOREIGN KEY ("leader_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;

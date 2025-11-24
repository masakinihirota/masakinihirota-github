ALTER TABLE "nation_memberships" DROP CONSTRAINT "nation_memberships_nation_id_nations_id_fk";
--> statement-breakpoint
ALTER TABLE "nation_memberships" DROP CONSTRAINT "nation_memberships_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_values" DROP CONSTRAINT "profile_values_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_values" DROP CONSTRAINT "profile_values_value_id_value_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_works" DROP CONSTRAINT "profile_works_profile_id_profiles_id_fk";
--> statement-breakpoint
ALTER TABLE "profile_works" DROP CONSTRAINT "profile_works_work_id_works_id_fk";
--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_root_account_id_root_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "root_accounts" DROP CONSTRAINT "root_accounts_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "nations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "nation_memberships" ADD CONSTRAINT "nation_memberships_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_memberships" ADD CONSTRAINT "nation_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_values" ADD CONSTRAINT "profile_values_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_values" ADD CONSTRAINT "profile_values_value_id_value_definitions_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."value_definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_works" ADD CONSTRAINT "profile_works_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_works" ADD CONSTRAINT "profile_works_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

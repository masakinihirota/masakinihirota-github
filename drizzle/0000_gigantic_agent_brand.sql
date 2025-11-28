
CREATE TABLE "nation_levels" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nation_memberships" (
	"nation_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "nation_memberships_nation_id_organization_id_pk" PRIMARY KEY("nation_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "nations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"leader_organization_id" uuid NOT NULL,
	"level_id" text DEFAULT 'Village',
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "organization_members" (
	"organization_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role_id" text DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "organization_members_organization_id_profile_id_pk" PRIMARY KEY("organization_id","profile_id")
);
--> statement-breakpoint
CREATE TABLE "organization_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"leader_profile_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_values" (
	"profile_id" uuid NOT NULL,
	"value_id" uuid NOT NULL,
	CONSTRAINT "profile_values_profile_id_value_id_pk" PRIMARY KEY("profile_id","value_id")
);
--> statement-breakpoint
CREATE TABLE "profile_works" (
	"profile_id" uuid NOT NULL,
	"work_id" uuid NOT NULL,
	CONSTRAINT "profile_works_profile_id_work_id_pk" PRIMARY KEY("profile_id","work_id")
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_account_id" uuid NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "root_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"display_name" text NOT NULL,
	"location" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "root_accounts_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "value_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "value_definitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"category_id" text
);
--> statement-breakpoint
CREATE TABLE "work_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category_id" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "nation_memberships" ADD CONSTRAINT "nation_memberships_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_memberships" ADD CONSTRAINT "nation_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_leader_organization_id_organizations_id_fk" FOREIGN KEY ("leader_organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nations" ADD CONSTRAINT "nations_level_id_nation_levels_id_fk" FOREIGN KEY ("level_id") REFERENCES "public"."nation_levels"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_role_id_organization_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."organization_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_leader_profile_id_profiles_id_fk" FOREIGN KEY ("leader_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_values" ADD CONSTRAINT "profile_values_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_values" ADD CONSTRAINT "profile_values_value_id_value_definitions_id_fk" FOREIGN KEY ("value_id") REFERENCES "public"."value_definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_works" ADD CONSTRAINT "profile_works_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_works" ADD CONSTRAINT "profile_works_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_root_account_id_root_accounts_id_fk" FOREIGN KEY ("root_account_id") REFERENCES "public"."root_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD CONSTRAINT "root_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "value_definitions" ADD CONSTRAINT "value_definitions_category_id_value_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."value_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works" ADD CONSTRAINT "works_category_id_work_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."work_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_nation_memberships_org_id" ON "nation_memberships" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_nations_leader_org_id" ON "nations" USING btree ("leader_organization_id");--> statement-breakpoint
CREATE INDEX "idx_nations_level_id" ON "nations" USING btree ("level_id");--> statement-breakpoint
CREATE INDEX "idx_org_members_profile_id" ON "organization_members" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_org_members_role_id" ON "organization_members" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX "idx_organizations_leader_profile_id" ON "organizations" USING btree ("leader_profile_id");--> statement-breakpoint
CREATE INDEX "idx_profile_values_value_id" ON "profile_values" USING btree ("value_id");--> statement-breakpoint
CREATE INDEX "idx_profile_works_work_id" ON "profile_works" USING btree ("work_id");--> statement-breakpoint
CREATE INDEX "idx_profiles_root_account_id" ON "profiles" USING btree ("root_account_id");--> statement-breakpoint
CREATE INDEX "idx_root_accounts_user_id" ON "root_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_value_definitions_category_id" ON "value_definitions" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_works_category_id" ON "works" USING btree ("category_id");--> statement-breakpoint
INSERT INTO "nation_levels" ("id", "name") VALUES ('Village', 'Village'), ('Town', 'Town'), ('City', 'City'), ('Metropolis', 'Metropolis');--> statement-breakpoint
INSERT INTO "organization_roles" ("id", "name") VALUES ('leader', 'Leader'), ('member', 'Member'), ('officer', 'Officer');--> statement-breakpoint
INSERT INTO "value_categories" ("id", "name") VALUES ('Personal', 'Personal'), ('Social', 'Social'), ('Professional', 'Professional'), ('Uncategorized', 'Uncategorized');--> statement-breakpoint
INSERT INTO "work_categories" ("id", "name") VALUES ('Book', 'Book'), ('Movie', 'Movie'), ('Game', 'Game'), ('Music', 'Music');

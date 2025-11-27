CREATE TABLE "nation_profile_roles" (
	"nation_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "nation_profile_roles_nation_id_profile_id_role_id_pk" PRIMARY KEY("nation_id","profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"description" text,
	"category" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"role_id" text NOT NULL,
	"permission_id" text NOT NULL,
	CONSTRAINT "role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "user_system_roles" (
	"user_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_system_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "work_aggregates" (
	"work_id" uuid PRIMARY KEY NOT NULL,
	"avg_score" numeric DEFAULT '0',
	"total_ratings" integer DEFAULT 0,
	"total_score" numeric DEFAULT '0',
	"claps_total" integer DEFAULT 0,
	"likes_count" integer DEFAULT 0,
	"tier1_count" integer DEFAULT 0,
	"tier2_count" integer DEFAULT 0,
	"tier3_count" integer DEFAULT 0,
	"normal_count" integer DEFAULT 0,
	"not_for_me_count" integer DEFAULT 0,
	"computed_rank" integer,
	"last_scored_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_role_id_organization_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "nation_profile_roles" ADD CONSTRAINT "nation_profile_roles_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_profile_roles" ADD CONSTRAINT "nation_profile_roles_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_profile_roles" ADD CONSTRAINT "nation_profile_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_system_roles" ADD CONSTRAINT "user_system_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_system_roles" ADD CONSTRAINT "user_system_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_aggregates" ADD CONSTRAINT "work_aggregates_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_nation_profile_roles_profile_id" ON "nation_profile_roles" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_work_aggregates_avg_score" ON "work_aggregates" USING btree ("avg_score");--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;
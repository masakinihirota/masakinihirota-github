CREATE TABLE "acl_exception_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"permission_id" text NOT NULL,
	"resource_type" text,
	"resource_id" uuid,
	"is_deny" boolean DEFAULT false,
	"granted_by" uuid,
	"reason" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "acl_group_closure" (
	"ancestor_id" uuid NOT NULL,
	"descendant_id" uuid NOT NULL,
	"depth" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "acl_group_closure_ancestor_id_descendant_id_pk" PRIMARY KEY("ancestor_id","descendant_id")
);
--> statement-breakpoint
CREATE TABLE "acl_group_role_assignments" (
	"group_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	CONSTRAINT "acl_group_role_assignments_group_id_role_id_pk" PRIMARY KEY("group_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "acl_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"ref_id" uuid,
	"parent_id" uuid
);
--> statement-breakpoint
CREATE TABLE "acl_nation_role_assignments" (
	"nation_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"role_id" text NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "acl_nation_role_assignments_nation_id_profile_id_role_id_pk" PRIMARY KEY("nation_id","profile_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "acl_permissions" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "acl_role_permissions" (
	"role_id" text NOT NULL,
	"permission_id" text NOT NULL,
	CONSTRAINT "acl_role_permissions_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE "acl_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "nation_profile_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organization_roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "role_permissions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "roles" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "nation_profile_roles" CASCADE;--> statement-breakpoint
DROP TABLE "organization_roles" CASCADE;--> statement-breakpoint
DROP TABLE "permissions" CASCADE;--> statement-breakpoint
DROP TABLE "role_permissions" CASCADE;--> statement-breakpoint
DROP TABLE "roles" CASCADE;--> statement-breakpoint
ALTER TABLE "organization_members" DROP CONSTRAINT "organization_members_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "user_system_roles" DROP CONSTRAINT "user_system_roles_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "acl_exception_grants" ADD CONSTRAINT "acl_exception_grants_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_exception_grants" ADD CONSTRAINT "acl_exception_grants_permission_id_acl_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."acl_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_exception_grants" ADD CONSTRAINT "acl_exception_grants_granted_by_profiles_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_group_closure" ADD CONSTRAINT "acl_group_closure_ancestor_id_acl_groups_id_fk" FOREIGN KEY ("ancestor_id") REFERENCES "public"."acl_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_group_closure" ADD CONSTRAINT "acl_group_closure_descendant_id_acl_groups_id_fk" FOREIGN KEY ("descendant_id") REFERENCES "public"."acl_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_group_role_assignments" ADD CONSTRAINT "acl_group_role_assignments_group_id_acl_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."acl_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_group_role_assignments" ADD CONSTRAINT "acl_group_role_assignments_role_id_acl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."acl_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_groups" ADD CONSTRAINT "acl_groups_parent_id_acl_groups_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."acl_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_nation_role_assignments" ADD CONSTRAINT "acl_nation_role_assignments_nation_id_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_nation_role_assignments" ADD CONSTRAINT "acl_nation_role_assignments_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_nation_role_assignments" ADD CONSTRAINT "acl_nation_role_assignments_role_id_acl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."acl_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_role_permissions" ADD CONSTRAINT "acl_role_permissions_role_id_acl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."acl_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acl_role_permissions" ADD CONSTRAINT "acl_role_permissions_permission_id_acl_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."acl_permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_role_id_acl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."acl_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_system_roles" ADD CONSTRAINT "user_system_roles_role_id_acl_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."acl_roles"("id") ON DELETE cascade ON UPDATE no action;
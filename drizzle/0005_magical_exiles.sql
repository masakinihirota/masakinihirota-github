CREATE TABLE "ledger_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"transaction_id" uuid NOT NULL,
	"ledger_id" uuid NOT NULL,
	"entry_direction" text NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"entry_type" text,
	"status" text,
	"counterpart_ledger_id" uuid,
	"context" text,
	"hash" text,
	"signer_type" text,
	"signer_id" text,
	"workflow_id" uuid,
	"consent_trace_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "profile_links" (
	"profile_id" uuid NOT NULL,
	"url" text NOT NULL,
	"label" text,
	"type" text,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profile_links_profile_id_url_pk" PRIMARY KEY("profile_id","url")
);
--> statement-breakpoint
CREATE TABLE "role_assignment_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_key" text NOT NULL,
	"operation" text NOT NULL,
	"operator_id" uuid,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_authorization_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"resource_id" uuid,
	"resource_type" text,
	"action" text NOT NULL,
	"allowed" boolean NOT NULL,
	"context_id" uuid,
	"expires_at" timestamp with time zone,
	"computed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_context_roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"context_type" text NOT NULL,
	"context_id" uuid NOT NULL,
	"role_key" text NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_to" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "mother_tongue" text;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "generation" text;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "is_ads_enabled" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "tutorial_step" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "profile_links" ADD CONSTRAINT "profile_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_ledger_entries_transaction" ON "ledger_entries" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "idx_ledger_entries_ledger" ON "ledger_entries" USING btree ("ledger_id");--> statement-breakpoint
CREATE INDEX "idx_ledger_entries_hash" ON "ledger_entries" USING btree ("hash");--> statement-breakpoint
CREATE INDEX "idx_ledger_entries_signer_type" ON "ledger_entries" USING btree ("signer_type");--> statement-breakpoint
CREATE INDEX "idx_profile_links_profile_id" ON "profile_links" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_role_assignment_history_user_id" ON "role_assignment_history" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_auth_perms_user_id" ON "user_authorization_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_auth_perms_resource" ON "user_authorization_permissions" USING btree ("resource_type","resource_id");--> statement-breakpoint
CREATE INDEX "idx_user_context_roles_user_id" ON "user_context_roles" USING btree ("user_id");
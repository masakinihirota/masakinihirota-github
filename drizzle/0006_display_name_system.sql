CREATE TABLE "banned_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" text NOT NULL,
	"category" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "banned_words_word_unique" UNIQUE("word")
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"list_id" uuid NOT NULL,
	"item_type" text NOT NULL,
	"item_id" uuid,
	"title" text,
	"position" integer DEFAULT 0,
	"metadata" jsonb,
	"added_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"owner_id" uuid NOT NULL,
	"visibility" text DEFAULT 'private' NOT NULL,
	"list_type" text DEFAULT 'custom',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "map_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"x" integer NOT NULL,
	"y" integer NOT NULL,
	"nation_id" uuid,
	"status" text DEFAULT 'occupied' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "map_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matching_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"candidate_profile_id" uuid NOT NULL,
	"work_score" numeric DEFAULT '0',
	"value_score" numeric DEFAULT '0',
	"total_score" numeric DEFAULT '0',
	"rank" smallint,
	"common_works" jsonb,
	"common_values" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "matching_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"status" text DEFAULT 'completed',
	"request_payload" jsonb,
	"result_snapshot" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid,
	"actor_profile_id" uuid,
	"action" text NOT NULL,
	"target_type" text,
	"target_id" uuid,
	"previous_value" jsonb,
	"new_value" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"owner_type" text NOT NULL,
	"owner_id" uuid NOT NULL,
	"balance" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_bank_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"type" text NOT NULL,
	"amount" integer NOT NULL,
	"balance_before" integer NOT NULL,
	"balance_after" integer NOT NULL,
	"related_account_id" uuid,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_loans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid NOT NULL,
	"principal_amount" integer NOT NULL,
	"remaining_amount" integer NOT NULL,
	"reason" text,
	"approved_by" uuid,
	"status" text DEFAULT 'active' NOT NULL,
	"due_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_market_applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"applicant_org_id" uuid NOT NULL,
	"applicant_profile_id" uuid NOT NULL,
	"message" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_market_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"author_org_id" uuid NOT NULL,
	"author_profile_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"reward_amount" integer DEFAULT 0,
	"status" text DEFAULT 'open' NOT NULL,
	"category" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "nation_market_ratings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid NOT NULL,
	"rater_profile_id" uuid NOT NULL,
	"ratee_profile_id" uuid NOT NULL,
	"rating" smallint NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "nation_mediators" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nation_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"profile_id" uuid NOT NULL,
	"rotation_order" integer NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "poetic_id_pools" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pool_type" text DEFAULT 'default' NOT NULL,
	"adjectives" jsonb NOT NULL,
	"qualities" jsonb NOT NULL,
	"nouns" jsonb NOT NULL,
	"nation_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "poetic_ids" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phrase" text NOT NULL,
	"pool_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "poetic_ids_phrase_unique" UNIQUE("phrase")
);
--> statement-breakpoint
CREATE TABLE "topdown_nation_memberships" (
	"nation_id" uuid NOT NULL,
	"organization_id" uuid NOT NULL,
	"membership_type" text DEFAULT 'visitor' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now(),
	"approved_by" uuid,
	CONSTRAINT "topdown_nation_memberships_nation_id_organization_id_pk" PRIMARY KEY("nation_id","organization_id")
);
--> statement-breakpoint
CREATE TABLE "topdown_nations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"founder_profile_id" uuid NOT NULL,
	"founder_organization_id" uuid,
	"scale_level" integer DEFAULT 1 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"rule_penalty_holder" text DEFAULT 'forbidden',
	"rule_yellow_card_limit" integer DEFAULT 0,
	"rule_red_card_limit" integer DEFAULT 0,
	"rule_trust_days_required" integer DEFAULT 0,
	"rule_min_members" integer DEFAULT 1,
	"rule_goal_match" boolean DEFAULT false,
	"market_tax_rate" integer DEFAULT 5,
	"residency_fee" integer DEFAULT 0,
	"grace_period_start_date" timestamp with time zone,
	"total_population" integer DEFAULT 0,
	"resident_org_count" integer DEFAULT 0,
	"visitor_org_count" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "topdown_nations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "venue_display_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"venue_type" text NOT NULL,
	"venue_id" uuid NOT NULL,
	"rule_type" text DEFAULT 'free' NOT NULL,
	"unified_net_name" text,
	"anonymous_default_name" text DEFAULT '匿名',
	"show_anonymous_id" text DEFAULT 'optional',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "poetic_id_id" uuid;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "display_name_type" text DEFAULT 'net_name';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_id_public" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "real_name" text;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "real_name_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "root_accounts" ADD COLUMN "default_display_name_type" text DEFAULT 'net_name';--> statement-breakpoint
ALTER TABLE "list_items" ADD CONSTRAINT "list_items_list_id_lists_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lists" ADD CONSTRAINT "lists_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_blocks" ADD CONSTRAINT "map_blocks_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_scores" ADD CONSTRAINT "matching_scores_session_id_matching_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."matching_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_scores" ADD CONSTRAINT "matching_scores_candidate_profile_id_profiles_id_fk" FOREIGN KEY ("candidate_profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matching_sessions" ADD CONSTRAINT "matching_sessions_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_audit_logs" ADD CONSTRAINT "nation_audit_logs_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_audit_logs" ADD CONSTRAINT "nation_audit_logs_actor_profile_id_profiles_id_fk" FOREIGN KEY ("actor_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_bank_accounts" ADD CONSTRAINT "nation_bank_accounts_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_bank_transactions" ADD CONSTRAINT "nation_bank_transactions_account_id_nation_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."nation_bank_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_bank_transactions" ADD CONSTRAINT "nation_bank_transactions_related_account_id_nation_bank_accounts_id_fk" FOREIGN KEY ("related_account_id") REFERENCES "public"."nation_bank_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_loans" ADD CONSTRAINT "nation_loans_account_id_nation_bank_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."nation_bank_accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_loans" ADD CONSTRAINT "nation_loans_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_applications" ADD CONSTRAINT "nation_market_applications_post_id_nation_market_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."nation_market_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_applications" ADD CONSTRAINT "nation_market_applications_applicant_org_id_organizations_id_fk" FOREIGN KEY ("applicant_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_applications" ADD CONSTRAINT "nation_market_applications_applicant_profile_id_profiles_id_fk" FOREIGN KEY ("applicant_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_posts" ADD CONSTRAINT "nation_market_posts_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_posts" ADD CONSTRAINT "nation_market_posts_author_org_id_organizations_id_fk" FOREIGN KEY ("author_org_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_posts" ADD CONSTRAINT "nation_market_posts_author_profile_id_profiles_id_fk" FOREIGN KEY ("author_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_ratings" ADD CONSTRAINT "nation_market_ratings_post_id_nation_market_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."nation_market_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_ratings" ADD CONSTRAINT "nation_market_ratings_rater_profile_id_profiles_id_fk" FOREIGN KEY ("rater_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_market_ratings" ADD CONSTRAINT "nation_market_ratings_ratee_profile_id_profiles_id_fk" FOREIGN KEY ("ratee_profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_mediators" ADD CONSTRAINT "nation_mediators_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_mediators" ADD CONSTRAINT "nation_mediators_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nation_mediators" ADD CONSTRAINT "nation_mediators_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poetic_ids" ADD CONSTRAINT "poetic_ids_pool_id_poetic_id_pools_id_fk" FOREIGN KEY ("pool_id") REFERENCES "public"."poetic_id_pools"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topdown_nation_memberships" ADD CONSTRAINT "topdown_nation_memberships_nation_id_topdown_nations_id_fk" FOREIGN KEY ("nation_id") REFERENCES "public"."topdown_nations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topdown_nation_memberships" ADD CONSTRAINT "topdown_nation_memberships_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topdown_nation_memberships" ADD CONSTRAINT "topdown_nation_memberships_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topdown_nations" ADD CONSTRAINT "topdown_nations_founder_profile_id_profiles_id_fk" FOREIGN KEY ("founder_profile_id") REFERENCES "public"."profiles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "topdown_nations" ADD CONSTRAINT "topdown_nations_founder_organization_id_organizations_id_fk" FOREIGN KEY ("founder_organization_id") REFERENCES "public"."organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_banned_words_word" ON "banned_words" USING btree ("word");--> statement-breakpoint
CREATE INDEX "idx_list_items_list_id" ON "list_items" USING btree ("list_id");--> statement-breakpoint
CREATE INDEX "idx_list_items_position" ON "list_items" USING btree ("position");--> statement-breakpoint
CREATE INDEX "idx_lists_owner_id" ON "lists" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_lists_visibility" ON "lists" USING btree ("visibility");--> statement-breakpoint
CREATE INDEX "idx_map_blocks_coord" ON "map_blocks" USING btree ("x","y");--> statement-breakpoint
CREATE INDEX "idx_map_blocks_nation" ON "map_blocks" USING btree ("nation_id");--> statement-breakpoint
CREATE INDEX "idx_matching_scores_session_id" ON "matching_scores" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_matching_scores_candidate_id" ON "matching_scores" USING btree ("candidate_profile_id");--> statement-breakpoint
CREATE INDEX "idx_matching_scores_total_score" ON "matching_scores" USING btree ("total_score");--> statement-breakpoint
CREATE INDEX "idx_matching_sessions_profile_id" ON "matching_sessions" USING btree ("profile_id");--> statement-breakpoint
CREATE INDEX "idx_matching_sessions_status" ON "matching_sessions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_nation" ON "nation_audit_logs" USING btree ("nation_id");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_action" ON "nation_audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "idx_audit_logs_created_at" ON "nation_audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_bank_accounts_nation" ON "nation_bank_accounts" USING btree ("nation_id");--> statement-breakpoint
CREATE INDEX "idx_bank_accounts_owner" ON "nation_bank_accounts" USING btree ("owner_type","owner_id");--> statement-breakpoint
CREATE INDEX "idx_bank_transactions_account" ON "nation_bank_transactions" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_bank_transactions_type" ON "nation_bank_transactions" USING btree ("type");--> statement-breakpoint
CREATE INDEX "idx_bank_transactions_created_at" ON "nation_bank_transactions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_loans_account" ON "nation_loans" USING btree ("account_id");--> statement-breakpoint
CREATE INDEX "idx_loans_status" ON "nation_loans" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_market_applications_post" ON "nation_market_applications" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_market_applications_applicant" ON "nation_market_applications" USING btree ("applicant_org_id");--> statement-breakpoint
CREATE INDEX "idx_market_posts_nation" ON "nation_market_posts" USING btree ("nation_id");--> statement-breakpoint
CREATE INDEX "idx_market_posts_author_org" ON "nation_market_posts" USING btree ("author_org_id");--> statement-breakpoint
CREATE INDEX "idx_market_posts_status" ON "nation_market_posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_market_ratings_post" ON "nation_market_ratings" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "idx_market_ratings_rater" ON "nation_market_ratings" USING btree ("rater_profile_id");--> statement-breakpoint
CREATE INDEX "idx_mediators_nation" ON "nation_mediators" USING btree ("nation_id");--> statement-breakpoint
CREATE INDEX "idx_mediators_active" ON "nation_mediators" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_poetic_ids_pool_id" ON "poetic_ids" USING btree ("pool_id");--> statement-breakpoint
CREATE INDEX "idx_poetic_ids_phrase" ON "poetic_ids" USING btree ("phrase");--> statement-breakpoint
CREATE INDEX "idx_topdown_memberships_org_id" ON "topdown_nation_memberships" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "idx_topdown_memberships_type" ON "topdown_nation_memberships" USING btree ("membership_type");--> statement-breakpoint
CREATE INDEX "idx_topdown_nations_founder" ON "topdown_nations" USING btree ("founder_profile_id");--> statement-breakpoint
CREATE INDEX "idx_topdown_nations_status" ON "topdown_nations" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_topdown_nations_scale_level" ON "topdown_nations" USING btree ("scale_level");--> statement-breakpoint
CREATE INDEX "idx_venue_display_rules_venue" ON "venue_display_rules" USING btree ("venue_type","venue_id");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_poetic_id_id_poetic_ids_id_fk" FOREIGN KEY ("poetic_id_id") REFERENCES "public"."poetic_ids"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_profiles_poetic_id" ON "profiles" USING btree ("poetic_id_id");
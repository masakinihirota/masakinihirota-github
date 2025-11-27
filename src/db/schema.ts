import { pgTable, text, timestamp, uuid, index, primaryKey, integer, jsonb, boolean, smallint, numeric } from "drizzle-orm/pg-core";
import { ValueCategory } from "./constants";


/**
 * --- ID Strategy ---
 * 1. System Entities (Users, Profiles, Organizations, etc.):
 *    - Type: UUID v4 (Postgres UUID)
 *    - Generation: Database-side `gen_random_uuid()` via `defaultRandom()`.
 *
 * 2. Reference/Master Data (Categories, Levels, Roles):
 *    - Type: Text ID (Human readable keys like 'Village', 'Leader')
 *    - Generation: Defined in Application Constants and synced to DB via Drizzle.
 *
 * --- Timestamp Strategy ---
 * - Type: TIMESTAMP WITH TIME ZONE
 * - Mode: Date object in application
 * - Default: `now()`
 */

// --- Reference Tables ---

export const workCategories = pgTable("work_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const valueCategories = pgTable("value_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  question: text("question"), // The question text displayed to users
  description: text("description"), // Internal description
});

export const nationLevels = pgTable("nation_levels", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const organizationRoles = pgTable("organization_roles", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

// --- Main Tables ---

// Users table (Synced with Supabase Auth)
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Supabase User ID
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
});

// Root Accounts (1:1 with Users)
export const rootAccounts = pgTable("root_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  location: text("location"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  userIdIdx: index("idx_root_accounts_user_id").on(t.userId),
}));

// Works Master (System Seeded)
export const works = pgTable("works", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  categoryId: text("category_id").notNull().references(() => workCategories.id),
  description: text("description"),
  authors: jsonb("authors"), // optional JSON list of authors
  releaseYear: integer("release_year"),
  genres: jsonb("genres"), // stored as json array of genres
  introUrl: text("intro_url"),
  affiliateUrl: text("affiliate_url"),
  size: text("size"),
  approved: boolean("approved").default(false),
  createdBy: uuid("created_by").references(() => rootAccounts.id, { onDelete: "set null" }),
}, (t) => ({
  categoryIdIdx: index("idx_works_category_id").on(t.categoryId),
}));

// Values Master (System Seeded)
export const valueDefinitions = pgTable("value_definitions", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  categoryId: text("category_id").notNull().default(ValueCategory.Uncategorized).references(() => valueCategories.id),
}, (t) => ({
  categoryIdIdx: index("idx_value_definitions_category_id").on(t.categoryId),
}));

// User Profiles (The "Masks")
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  rootAccountId: uuid("root_account_id").notNull().references(() => rootAccounts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  rootAccountIdIdx: index("idx_profiles_root_account_id").on(t.rootAccountId),
}));

  // Aggregates computed by batch job
  export const workAggregates = pgTable("work_aggregates", {
    workId: uuid("work_id").primaryKey().references(() => works.id, { onDelete: "cascade" }),
    avgScore: numeric("avg_score").default('0'),
    totalRatings: integer("total_ratings").default(0),
    totalScore: numeric("total_score").default('0'),
    clapsTotal: integer("claps_total").default(0),
    likesCount: integer("likes_count").default(0),
    tier1Count: integer("tier1_count").default(0),
    tier2Count: integer("tier2_count").default(0),
    tier3Count: integer("tier3_count").default(0),
    normalCount: integer("normal_count").default(0),
    notForMeCount: integer("not_for_me_count").default(0),
    computedRank: integer("computed_rank"),
    lastScoredAt: timestamp("last_scored_at", { withTimezone: true, mode: "date" }).defaultNow(),
  }, (t) => ({
    avgIdx: index("idx_work_aggregates_avg_score").on(t.avgScore),
  }));
// Profile Works (Many-to-Many)
export const profileWorks = pgTable("profile_works", {
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId: uuid("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
  status: text("status").default('now'), // 'now'|'life'|'future'
  tier: smallint("tier"),
  claps: integer("claps").default(0),
  liked: boolean("liked").default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.profileId, t.workId] }),
  workIdx: index("idx_profile_works_work_id").on(t.workId),
}));

// Profile Values (Many-to-Many)
export const profileValues = pgTable("profile_values", {
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  valueId: uuid("value_id").notNull().references(() => valueDefinitions.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.profileId, t.valueId] }),
  valueIdx: index("idx_profile_values_value_id").on(t.valueId),
}));

// Organizations
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  leaderProfileId: uuid("leader_profile_id").references(() => profiles.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  leaderProfileIdIdx: index("idx_organizations_leader_profile_id").on(t.leaderProfileId),
}));

// Organization Members
export const organizationMembers = pgTable("organization_members", {
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().default('member').references(() => organizationRoles.id),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.organizationId, t.profileId] }),
  profileIdx: index("idx_org_members_profile_id").on(t.profileId),
  roleIdIdx: index("idx_org_members_role_id").on(t.roleId),
}));

// Nations
export const nations = pgTable("nations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  leaderOrganizationId: uuid("leader_organization_id").references(() => organizations.id, { onDelete: "set null" }),
  levelId: text("level_id").default('Village').references(() => nationLevels.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  leaderOrgIdx: index("idx_nations_leader_org_id").on(t.leaderOrganizationId),
  levelIdIdx: index("idx_nations_level_id").on(t.levelId),
}));

// Nation Memberships (Organizations joining Nations)
export const nationMemberships = pgTable("nation_memberships", {
  nationId: uuid("nation_id").notNull().references(() => nations.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.nationId, t.organizationId] }),
  orgIdx: index("idx_nation_memberships_org_id").on(t.organizationId),
}));

// Points ledger
export const rootAccountPoints = pgTable("root_account_points", {
  rootAccountId: uuid("root_account_id").primaryKey().references(() => rootAccounts.id, { onDelete: "cascade" }),
  balance: integer("balance").default(0),
  lastUpdated: timestamp("last_updated", { withTimezone: true, mode: "date" }).defaultNow(),
});

export const pointTransactions = pgTable("point_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  rootAccountId: uuid("root_account_id").references(() => rootAccounts.id, { onDelete: "cascade" }),
  delta: integer("delta").notNull(),
  reason: text("reason"),
  relatedEntity: text("related_entity"),
  relatedId: uuid("related_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  rootIdx: index("idx_point_transactions_root_account_id").on(t.rootAccountId),
}));

// Penalties
export const penalties = pgTable("penalties", {
  id: uuid("id").defaultRandom().primaryKey(),
  rootAccountId: uuid("root_account_id").references(() => rootAccounts.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  description: text("description"),
  appliedBy: uuid("applied_by"),
  appliedAt: timestamp("applied_at", { withTimezone: true, mode: "date" }).defaultNow(),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
}, (t) => ({
  rootIdx: index("idx_penalties_root_account_id").on(t.rootAccountId),
}));

// Achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
});

export const rootAccountAchievements = pgTable("root_account_achievements", {
  id: uuid("id").defaultRandom().primaryKey(),
  rootAccountId: uuid("root_account_id").references(() => rootAccounts.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id").references(() => achievements.id, { onDelete: "cascade" }),
  awardedAt: timestamp("awarded_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  rootIdx: index("idx_root_account_achievements_root_account_id").on(t.rootAccountId),
}));

// Skills
export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const profileSkills = pgTable("profile_skills", {
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  skillId: uuid("skill_id").notNull().references(() => skills.id, { onDelete: "cascade" }),
  level: smallint("level").default(0),
}, (t) => ({
  pk: primaryKey({ columns: [t.profileId, t.skillId] }),
  skillIdx: index("idx_profile_skills_skill_id").on(t.skillId),
}));

// Follows
export const follows = pgTable("follows", {
  followerProfileId: uuid("follower_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  targetProfileId: uuid("target_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.followerProfileId, t.targetProfileId] }),
}));

// Match history
export const matchHistory = pgTable("match_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  matchedProfileId: uuid("matched_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  score: numeric("score"),
  matchedAt: timestamp("matched_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  profileIdx: index("idx_match_history_profile_id").on(t.profileId),
}));

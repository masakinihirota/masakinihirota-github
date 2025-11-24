import { pgTable, text, timestamp, uuid, index, primaryKey } from "drizzle-orm/pg-core";
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

// Profile Works (Many-to-Many)
export const profileWorks = pgTable("profile_works", {
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workId: uuid("work_id").notNull().references(() => works.id, { onDelete: "cascade" }),
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

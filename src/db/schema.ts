import { pgTable, text, timestamp, uuid, index, primaryKey, integer, jsonb, boolean, smallint, numeric, AnyPgColumn } from "drizzle-orm/pg-core";
import { ValueCategory, DisplayNameType, PoeticIdPoolType } from "./constants";


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

// =====================================================
// 表示名システム (Display Name System)
// =====================================================

/**
 * 詩的ID単語プール
 * 形容詞 + 色/質感 + 名詞 の組み合わせを保持
 */
export const poeticIdPools = pgTable("poetic_id_pools", {
  id: text("id").primaryKey(), // 'default', 'japanese', 'western' など
  name: text("name").notNull(),
  poolType: text("pool_type").notNull().default(PoeticIdPoolType.Default),
  adjectives: jsonb("adjectives").notNull().$type<string[]>(), // 形容詞配列
  qualities: jsonb("qualities").notNull().$type<string[]>(),   // 色/質感配列
  nouns: jsonb("nouns").notNull().$type<string[]>(),           // 名詞配列
  nationId: uuid("nation_id"), // 国カスタムの場合（後でtopdownNationsへの参照を追加）
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
});

/**
 * 生成された詩的ID
 * 一度生成された詩的IDは一意に保持される
 */
export const poeticIds = pgTable("poetic_ids", {
  id: uuid("id").defaultRandom().primaryKey(),
  phrase: text("phrase").notNull().unique(), // 詩的IDフレーズ（例: "黒き闇の白い燭台"）
  poolId: text("pool_id").notNull().references(() => poeticIdPools.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  poolIdx: index("idx_poetic_ids_pool_id").on(t.poolId),
  phraseIdx: index("idx_poetic_ids_phrase").on(t.phrase),
}));

/**
 * 場所の表示名ルール設定
 */
export const venueDisplayRules = pgTable("venue_display_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  venueType: text("venue_type").notNull(), // 'nation' | 'organization' | 'board'
  venueId: uuid("venue_id").notNull(),
  ruleType: text("rule_type").notNull().default("free"), // 表示名ルール
  unifiedNetName: text("unified_net_name"), // 統一ネットネーム（該当ルールの場合）
  anonymousDefaultName: text("anonymous_default_name").default("匿名"), // 匿名時のデフォルト名
  showAnonymousId: text("show_anonymous_id").default("optional"), // 匿名ID表示設定
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  venueIdx: index("idx_venue_display_rules_venue").on(t.venueType, t.venueId),
}));

/**
 * 禁止ワードリスト
 */
export const bannedWords = pgTable("banned_words", {
  id: uuid("id").defaultRandom().primaryKey(),
  word: text("word").notNull().unique(),
  category: text("category").notNull(), // 'hate' | 'discrimination' | 'obscene' など
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  wordIdx: index("idx_banned_words_word").on(t.word),
}));


// --- ACL (RBAC) Tables ---

export const aclPermissions = pgTable("acl_permissions", {
  id: text("id").primaryKey(), // e.g. 'system.users.manage'
  category: text("category").notNull(), // 'system', 'organization', 'nation'
  description: text("description"),
});

export const aclRoles = pgTable("acl_roles", {
  id: text("id").primaryKey(), // e.g. 'sys_admin', 'org_leader'
  name: text("name").notNull(),
  scope: text("scope").notNull(), // 'system', 'organization', 'nation'
  description: text("description"),
});

export const aclRolePermissions = pgTable("acl_role_permissions", {
  roleId: text("role_id").notNull().references(() => aclRoles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => aclPermissions.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
}));

// Group / Hierarchy support
export const aclGroups = pgTable("acl_groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // 'organization', 'nation', 'system_group'
  refId: uuid("ref_id"), // Reference to organization_id or nation_id
  parentId: uuid("parent_id").references((): AnyPgColumn => aclGroups.id, { onDelete: "cascade" }),
});

// Closure table for efficient hierarchy traversal
export const aclGroupClosure = pgTable("acl_group_closure", {
  ancestorId: uuid("ancestor_id").notNull().references(() => aclGroups.id, { onDelete: "cascade" }),
  descendantId: uuid("descendant_id").notNull().references(() => aclGroups.id, { onDelete: "cascade" }),
  depth: integer("depth").notNull().default(0),
}, (t) => ({
  pk: primaryKey({ columns: [t.ancestorId, t.descendantId] }),
}));

// Assign roles to groups (e.g. "All Members of Org X have Role Y")
export const aclGroupRoleAssignments = pgTable("acl_group_role_assignments", {
  groupId: uuid("group_id").notNull().references(() => aclGroups.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => aclRoles.id, { onDelete: "cascade" }),
}, (t) => ({
  pk: primaryKey({ columns: [t.groupId, t.roleId] }),
}));

// Direct user assignments (System roles, etc)
export const userSystemRoles = pgTable("user_system_roles", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => aclRoles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.roleId] }),
}));

// Nation specific role assignments
export const aclNationRoleAssignments = pgTable("acl_nation_role_assignments", {
  nationId: uuid("nation_id").notNull().references(() => nations.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  roleId: text("role_id").notNull().references(() => aclRoles.id, { onDelete: "cascade" }),
  assignedAt: timestamp("assigned_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.nationId, t.profileId, t.roleId] }),
}));

// Exception grants (Individual permission overrides)
export const aclExceptionGrants = pgTable("acl_exception_grants", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  permissionId: text("permission_id").notNull().references(() => aclPermissions.id, { onDelete: "cascade" }),
  resourceType: text("resource_type"), // e.g. 'work', 'organization'
  resourceId: uuid("resource_id"),
  isDeny: boolean("is_deny").default(false), // True = Deny, False = Allow
  grantedBy: uuid("granted_by").references(() => profiles.id),
  reason: text("reason"),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
});

// RBAC: user-context roles and history
export const userContextRoles = pgTable("user_context_roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  contextType: text("context_type").notNull(), // 'nation'|'organization'
  contextId: uuid("context_id").notNull(),
  roleKey: text("role_key").notNull(),
  validFrom: timestamp("valid_from", { withTimezone: true, mode: "date" }),
  validTo: timestamp("valid_to", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  userIdx: index("idx_user_context_roles_user_id").on(t.userId),
}));

export const roleAssignmentHistory = pgTable("role_assignment_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  roleKey: text("role_key").notNull(),
  operation: text("operation").notNull(), // assign|revoke
  operatorId: uuid("operator_id"),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  userIdx: index("idx_role_assignment_history_user_id").on(t.userId),
}));

export const userAuthorizationPermissions = pgTable("user_authorization_permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  resourceId: uuid("resource_id"),
  resourceType: text("resource_type"),
  action: text("action").notNull(),
  allowed: boolean("allowed").notNull(),
  contextId: uuid("context_id"),
  expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }),
  computedAt: timestamp("computed_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  userIdx: index("idx_user_auth_perms_user_id").on(t.userId),
  resourceIdx: index("idx_user_auth_perms_resource").on(t.resourceType, t.resourceId),
}));

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
  motherTongue: text("mother_tongue"),
  generation: text("generation"),
  isAdsEnabled: boolean("is_ads_enabled").default(true),
  tutorialStep: integer("tutorial_step").default(0),
  // 表示名システム: 実名関連
  realName: text("real_name"), // 実名（1つのみ）
  realNameVerified: boolean("real_name_verified").default(false), // 本人確認ステータス
  defaultDisplayNameType: text("default_display_name_type").default(DisplayNameType.NetName), // デフォルト表示名タイプ
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
  name: text("name").notNull(), // ネットネーム（表示名）
  bio: text("bio"),
  // 表示名システム: 詩的ID関連
  poeticIdId: uuid("poetic_id_id").references(() => poeticIds.id, { onDelete: "set null" }), // 詩的ID
  displayNameType: text("display_name_type").default(DisplayNameType.NetName), // このプロフィールの表示名タイプ
  isIdPublic: boolean("is_id_public").default(true), // ID公開/非公開設定
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  rootAccountIdIdx: index("idx_profiles_root_account_id").on(t.rootAccountId),
  poeticIdIdx: index("idx_profiles_poetic_id").on(t.poeticIdId),
}));

  // Profile Links (external contact / social links for a profile)
  export const profileLinks = pgTable("profile_links", {
    profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    label: text("label"),
    type: text("type"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  }, (t) => ({
    pk: primaryKey({ columns: [t.profileId, t.url] }),
    profileIdx: index("idx_profile_links_profile_id").on(t.profileId),
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

// (Duplicate profileLinks declaration removed — the first declaration above includes the 'type' column and is kept.)

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
  roleId: text("role_id").notNull().default('member').references(() => aclRoles.id),
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.organizationId, t.profileId] }),
  profileIdx: index("idx_org_members_profile_id").on(t.profileId),
  roleIdIdx: index("idx_org_members_role_id").on(t.roleId),
}));



// Nations (レガシーテーブル - 互換性維持)
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

// =====================================================
// Topdown Nations (トップダウン国 - 内政機能拡張版)
// =====================================================

// トップダウン国基本情報
export const topdownNations = pgTable("topdown_nations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),  // 理念・目的
  founderProfileId: uuid("founder_profile_id").notNull().references(() => profiles.id, { onDelete: "set null" }),
  founderOrganizationId: uuid("founder_organization_id").references(() => organizations.id, { onDelete: "set null" }),
  scaleLevel: integer("scale_level").notNull().default(1), // 規模レベル (1-8)
  status: text("status").notNull().default('active'), // active, suspended, archived

  // 簡易ルール設定
  rulePenaltyHolder: text("rule_penalty_holder").default('forbidden'), // forbidden | allowed
  ruleYellowCardLimit: integer("rule_yellow_card_limit").default(0),
  ruleRedCardLimit: integer("rule_red_card_limit").default(0),
  ruleTrustDaysRequired: integer("rule_trust_days_required").default(0),
  ruleMinMembers: integer("rule_min_members").default(1),
  ruleGoalMatch: boolean("rule_goal_match").default(false), // 目的一致必須

  // 税率設定
  marketTaxRate: integer("market_tax_rate").default(5), // マーケット手数料（%）
  residencyFee: integer("residency_fee").default(0), // 常駐料金（ポイント/月）

  // ポイント徴収関連 (Task 9.1: FR-130-003)
  gracePeriodStartDate: timestamp("grace_period_start_date", { withTimezone: true, mode: "date" }), // 猶予期間開始日

  // 統計情報（定期更新）
  totalPopulation: integer("total_population").default(0),
  residentOrgCount: integer("resident_org_count").default(0),
  visitorOrgCount: integer("visitor_org_count").default(0),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  founderIdx: index("idx_topdown_nations_founder").on(t.founderProfileId),
  statusIdx: index("idx_topdown_nations_status").on(t.status),
  scaleLevelIdx: index("idx_topdown_nations_scale_level").on(t.scaleLevel),
}));

// 国メンバーシップ（組織単位）
export const topdownNationMemberships = pgTable("topdown_nation_memberships", {
  nationId: uuid("nation_id").notNull().references(() => topdownNations.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  membershipType: text("membership_type").notNull().default('visitor'), // resident | visitor
  joinedAt: timestamp("joined_at", { withTimezone: true, mode: "date" }).defaultNow(),
  approvedBy: uuid("approved_by").references(() => profiles.id),
}, (t) => ({
  pk: primaryKey({ columns: [t.nationId, t.organizationId] }),
  orgIdx: index("idx_topdown_memberships_org_id").on(t.organizationId),
  typeIdx: index("idx_topdown_memberships_type").on(t.membershipType),
}));

// =====================================================
// 国銀行システム
// =====================================================

// 国銀行口座
export const nationBankAccounts = pgTable("nation_bank_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationId: uuid("nation_id").notNull().references(() => topdownNations.id, { onDelete: "cascade" }),
  ownerType: text("owner_type").notNull(), // 'nation' (国庫) | 'organization' (組織)
  ownerId: uuid("owner_id").notNull(), // 国ID または 組織ID
  balance: integer("balance").notNull().default(0), // ポイント残高（bigintの代わりにinteger使用）
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  nationIdx: index("idx_bank_accounts_nation").on(t.nationId),
  ownerIdx: index("idx_bank_accounts_owner").on(t.ownerType, t.ownerId),
}));

// 銀行取引履歴
export const nationBankTransactions = pgTable("nation_bank_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => nationBankAccounts.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // deposit, withdrawal, transfer, fee, tax, loan, loan_repayment, maintenance_fee
  amount: integer("amount").notNull(), // 変動額（+入金, -出金）
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  relatedAccountId: uuid("related_account_id").references(() => nationBankAccounts.id), // 送金先/元口座ID
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  accountIdx: index("idx_bank_transactions_account").on(t.accountId),
  typeIdx: index("idx_bank_transactions_type").on(t.type),
  createdAtIdx: index("idx_bank_transactions_created_at").on(t.createdAt),
}));

// ローン情報
export const nationLoans = pgTable("nation_loans", {
  id: uuid("id").defaultRandom().primaryKey(),
  accountId: uuid("account_id").notNull().references(() => nationBankAccounts.id, { onDelete: "cascade" }),
  principalAmount: integer("principal_amount").notNull(), // 借入元本
  remainingAmount: integer("remaining_amount").notNull(), // 残高
  reason: text("reason"),
  approvedBy: uuid("approved_by").references(() => profiles.id),
  status: text("status").notNull().default('active'), // active, repaid, defaulted
  dueDate: timestamp("due_date", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  accountIdx: index("idx_loans_account").on(t.accountId),
  statusIdx: index("idx_loans_status").on(t.status),
}));

// =====================================================
// マーケット（掲示板）
// =====================================================

// マーケット投稿
export const nationMarketPosts = pgTable("nation_market_posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationId: uuid("nation_id").notNull().references(() => topdownNations.id, { onDelete: "cascade" }),
  authorOrgId: uuid("author_org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  authorProfileId: uuid("author_profile_id").notNull().references(() => profiles.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  rewardAmount: integer("reward_amount").default(0), // 報酬ポイント
  status: text("status").notNull().default('open'), // open, closed, completed
  category: text("category"), // 投稿カテゴリ（任意）
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
  closedAt: timestamp("closed_at", { withTimezone: true, mode: "date" }),
}, (t) => ({
  nationIdx: index("idx_market_posts_nation").on(t.nationId),
  authorOrgIdx: index("idx_market_posts_author_org").on(t.authorOrgId),
  statusIdx: index("idx_market_posts_status").on(t.status),
}));

// マーケット応募
export const nationMarketApplications = pgTable("nation_market_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => nationMarketPosts.id, { onDelete: "cascade" }),
  applicantOrgId: uuid("applicant_org_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  applicantProfileId: uuid("applicant_profile_id").notNull().references(() => profiles.id),
  message: text("message"),
  status: text("status").notNull().default('pending'), // pending, accepted, rejected, completed
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  postIdx: index("idx_market_applications_post").on(t.postId),
  applicantIdx: index("idx_market_applications_applicant").on(t.applicantOrgId),
}));

// マーケット取引評価
export const nationMarketRatings = pgTable("nation_market_ratings", {
  id: uuid("id").defaultRandom().primaryKey(),
  postId: uuid("post_id").notNull().references(() => nationMarketPosts.id, { onDelete: "cascade" }),
  raterProfileId: uuid("rater_profile_id").notNull().references(() => profiles.id),
  rateeProfileId: uuid("ratee_profile_id").notNull().references(() => profiles.id),
  rating: smallint("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  postIdx: index("idx_market_ratings_post").on(t.postId),
  raterIdx: index("idx_market_ratings_rater").on(t.raterProfileId),
}));

// =====================================================
// 調停者管理
// =====================================================

// 調停者ローテーション
export const nationMediators = pgTable("nation_mediators", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationId: uuid("nation_id").notNull().references(() => topdownNations.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: "cascade" }),
  profileId: uuid("profile_id").notNull().references(() => profiles.id),
  rotationOrder: integer("rotation_order").notNull(),
  isActive: boolean("is_active").notNull().default(false),
  startDate: timestamp("start_date", { withTimezone: true, mode: "date" }),
  endDate: timestamp("end_date", { withTimezone: true, mode: "date" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  nationIdx: index("idx_mediators_nation").on(t.nationId),
  activeIdx: index("idx_mediators_active").on(t.isActive),
}));

// =====================================================
// マップシステム（2Dグリッド）
// =====================================================

// マップブロック（疎行列アプローチ - 占有されているブロックのみ保存）
export const mapBlocks = pgTable("map_blocks", {
  id: uuid("id").defaultRandom().primaryKey(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  nationId: uuid("nation_id").references(() => topdownNations.id, { onDelete: "set null" }),
  status: text("status").notNull().default('occupied'), // occupied, reserved, special
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  coordIdx: index("idx_map_blocks_coord").on(t.x, t.y),
  nationIdx: index("idx_map_blocks_nation").on(t.nationId),
}));

// マップ設定（システム変数）
export const mapSettings = pgTable("map_settings", {
  key: text("key").primaryKey(), // e.g., 'world_width', 'fog_radius'
  value: jsonb("value").notNull(),
});

// =====================================================
// 監査ログ
// =====================================================

// 国関連監査ログ
export const nationAuditLogs = pgTable("nation_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  nationId: uuid("nation_id").references(() => topdownNations.id, { onDelete: "set null" }),
  actorProfileId: uuid("actor_profile_id").references(() => profiles.id),
  action: text("action").notNull(), // create, update, delete, join, leave, etc.
  targetType: text("target_type"), // nation, membership, bank, market, etc.
  targetId: uuid("target_id"),
  previousValue: jsonb("previous_value"),
  newValue: jsonb("new_value"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  nationIdx: index("idx_audit_logs_nation").on(t.nationId),
  actionIdx: index("idx_audit_logs_action").on(t.action),
  createdAtIdx: index("idx_audit_logs_created_at").on(t.createdAt),
}));

// Nation Memberships (Organizations joining Nations) - レガシー互換
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

// Ledger entries (double-entry bookkeeping logs)
export const ledgerEntries = pgTable("ledger_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id").notNull(),
  ledgerId: uuid("ledger_id").notNull(),
  entryDirection: text("entry_direction").notNull(), // 'in' | 'out'
  amount: integer("amount").notNull(),
  balanceBefore: integer("balance_before").notNull(),
  balanceAfter: integer("balance_after").notNull(),
  entryType: text("entry_type"),
  status: text("status"),
  counterpartLedgerId: uuid("counterpart_ledger_id"),
  context: text("context"),
  hash: text("hash"),
  signerType: text("signer_type"),
  signerId: text("signer_id"),
  workflowId: uuid("workflow_id"),
  consentTraceId: uuid("consent_trace_id"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  transactionIdx: index("idx_ledger_entries_transaction").on(t.transactionId),
  ledgerIdx: index("idx_ledger_entries_ledger").on(t.ledgerId),
  hashIdx: index("idx_ledger_entries_hash").on(t.hash),
  signerIdx: index("idx_ledger_entries_signer_type").on(t.signerType),
}));

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

// Lists (カスタムリスト)
export const lists = pgTable("lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  ownerId: uuid("owner_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  visibility: text("visibility").default('private').notNull(), // 'public' | 'private' | 'restricted'
  listType: text("list_type").default('custom'), // 'favorites' | 'oshi' | 'reading' | 'todo' | 'custom'
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  ownerIdx: index("idx_lists_owner_id").on(t.ownerId),
  visibilityIdx: index("idx_lists_visibility").on(t.visibility),
}));

// List Items (リスト内アイテム)
export const listItems = pgTable("list_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  listId: uuid("list_id").notNull().references(() => lists.id, { onDelete: "cascade" }),
  itemType: text("item_type").notNull(), // 'work' | 'profile' | 'value' | 'skill' | 'custom'
  itemId: uuid("item_id"), // 参照先ID（optional - カスタムの場合null可）
  title: text("title"), // カスタムアイテムの場合のタイトル
  position: integer("position").default(0),
  metadata: jsonb("metadata"), // 追加情報
  addedAt: timestamp("added_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  listIdx: index("idx_list_items_list_id").on(t.listId),
  positionIdx: index("idx_list_items_position").on(t.position),
}));

// Matching Sessions (自動マッチングセッション)
export const matchingSessions = pgTable("matching_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileId: uuid("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  status: text("status").default('completed'), // 'pending' | 'processing' | 'completed' | 'failed'
  requestPayload: jsonb("request_payload"), // マッチング条件
  resultSnapshot: jsonb("result_snapshot"), // マッチング結果のスナップショット
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  profileIdx: index("idx_matching_sessions_profile_id").on(t.profileId),
  statusIdx: index("idx_matching_sessions_status").on(t.status),
}));

// Matching Scores (マッチングスコア詳細)
export const matchingScores = pgTable("matching_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id").notNull().references(() => matchingSessions.id, { onDelete: "cascade" }),
  candidateProfileId: uuid("candidate_profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  workScore: numeric("work_score").default('0'),
  valueScore: numeric("value_score").default('0'),
  totalScore: numeric("total_score").default('0'),
  rank: smallint("rank"),
  commonWorks: jsonb("common_works"), // 共通作品のリスト
  commonValues: jsonb("common_values"), // 共通価値観のリスト
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow(),
}, (t) => ({
  sessionIdx: index("idx_matching_scores_session_id").on(t.sessionId),
  candidateIdx: index("idx_matching_scores_candidate_id").on(t.candidateProfileId),
  totalScoreIdx: index("idx_matching_scores_total_score").on(t.totalScore),
}));

/**
 * マスターデータシード
 * カテゴリ、レベル、RBACなどの参照データを投入
 */

import { db } from "@/lib/db";
import {
  workCategories,
  valueCategories,
  nationLevels,
} from "@/db/schema";
import {
  WorkCategory,
  ValueCategory,
  NationLevel,
} from "@/db/constants";
import { seedRBAC } from "./rbac";

export interface SeedMasterOptions {
  /** RBAC シードをスキップするか */
  skipRBAC?: boolean;
  /** ログを出力するか */
  verbose?: boolean;
}

export interface SeedMasterResult {
  workCategoriesSeeded: number;
  valueCategoriesSeeded: number;
  nationLevelsSeeded: number;
  rbacSeeded: boolean;
}

/**
 * マスターデータをシードする
 */
export async function seedMasterData(options: SeedMasterOptions = {}): Promise<SeedMasterResult> {
  const { skipRBAC = false, verbose = true } = options;

  if (verbose) console.log("🌱 Seeding Master Data...");

  // 1. Work Categories
  if (verbose) console.log("   - Seeding Work Categories...");
  const workCategoryValues = Object.values(WorkCategory).map(c => ({
    id: c,
    name: c
  }));
  await db.insert(workCategories).values(workCategoryValues).onConflictDoNothing();

  // 2. Value Categories
  if (verbose) console.log("   - Seeding Value Categories...");
  const valueCategoryValues = Object.values(ValueCategory).map(c => ({
    id: c,
    name: c,
    description: `Category for ${c} values`
  }));
  await db.insert(valueCategories).values(valueCategoryValues).onConflictDoNothing();

  // 3. Nation Levels
  if (verbose) console.log("   - Seeding Nation Levels...");
  const nationLevelValues = Object.values(NationLevel).map(l => ({
    id: l,
    name: l
  }));
  await db.insert(nationLevels).values(nationLevelValues).onConflictDoNothing();

  // 4. RBAC
  let rbacSeeded = false;
  if (!skipRBAC) {
    await seedRBAC();
    rbacSeeded = true;
  }

  if (verbose) console.log("✅ Master Data Seeding completed.");

  return {
    workCategoriesSeeded: workCategoryValues.length,
    valueCategoriesSeeded: valueCategoryValues.length,
    nationLevelsSeeded: nationLevelValues.length,
    rbacSeeded,
  };
}

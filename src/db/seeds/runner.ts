/**
 * シードランナー
 * 全てのシード処理を統合的に実行
 */

import { seedMasterData, type SeedMasterOptions } from "./master";
import { seedDummyData, type SeedDummyOptions } from "./dummy";

export interface SeedAllOptions {
  master?: SeedMasterOptions;
  dummy?: SeedDummyOptions;
  /** ダミーデータをスキップするか */
  skipDummy?: boolean;
  /** 詳細なログを出力するか */
  verbose?: boolean;
}

export interface SeedAllResult {
  master: Awaited<ReturnType<typeof seedMasterData>>;
  dummy?: Awaited<ReturnType<typeof seedDummyData>>;
  success: boolean;
  duration: number;
}

/**
 * 全てのシードデータを投入する
 */
export async function seedAll(options: SeedAllOptions = {}): Promise<SeedAllResult> {
  const { skipDummy = false, verbose = true } = options;
  const startTime = Date.now();

  if (verbose) console.log("🚀 Starting seed process...");

  try {
    // 1. Master Data
    const masterResult = await seedMasterData({
      ...options.master,
      verbose,
    });

    // 2. Dummy Data (optional)
    let dummyResult: Awaited<ReturnType<typeof seedDummyData>> | undefined;
    if (!skipDummy) {
      dummyResult = await seedDummyData({
        ...options.dummy,
        verbose,
      });
    }

    const duration = Date.now() - startTime;
    if (verbose) console.log(`\n✨ Seed process completed in ${duration}ms`);

    return {
      master: masterResult,
      dummy: dummyResult,
      success: true,
      duration,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    if (verbose) console.error(`\n❌ Seed process failed after ${duration}ms:`, error);
    throw error;
  }
}

/**
 * DBをリセットしてシードを実行する
 * 注意: 全てのデータが削除されます
 */
export async function resetAndSeed(options: SeedAllOptions = {}): Promise<SeedAllResult> {
  const { verbose = true } = options;

  if (verbose) console.log("⚠️  Reset and Seed: This will delete all existing data!");
  if (verbose) console.log("   Use supabase:reset command to reset the database first.");
  if (verbose) console.log("   Then run this seed script.");

  // Note: Actual reset should be done via supabase db reset
  // This function only handles seeding
  return seedAll(options);
}

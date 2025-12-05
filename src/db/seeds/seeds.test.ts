/**
 * シードデータ整備スクリプトのテスト
 * Task 10.3: シードデータ整備スクリプト作成
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// モックDB (シンプルな形式)
vi.mock('@/lib/db', () => {
  const mockReturning = vi.fn().mockResolvedValue([]);
  const mockOnConflictDoNothing = vi.fn().mockResolvedValue(undefined);
  const mockValues = vi.fn().mockImplementation(() => ({
    onConflictDoNothing: mockOnConflictDoNothing,
    returning: mockReturning,
  }));
  const mockInsert = vi.fn().mockImplementation(() => ({
    values: mockValues,
  }));

  return {
    db: {
      insert: mockInsert,
    },
    __mocks__: {
      mockInsert,
      mockValues,
      mockOnConflictDoNothing,
      mockReturning,
    },
  };
});

describe('シードデータ整備スクリプト', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // モジュールキャッシュをリセット
    vi.resetModules();
  });

  describe('seedMasterData', () => {
    it('マスターデータをシードできること', async () => {
      const { seedMasterData } = await import('@/db/seeds/master');

      const result = await seedMasterData({ verbose: false, skipRBAC: true });

      expect(result).toHaveProperty('workCategoriesSeeded');
      expect(result).toHaveProperty('valueCategoriesSeeded');
      expect(result).toHaveProperty('nationLevelsSeeded');
      expect(result.workCategoriesSeeded).toBeGreaterThan(0);
      expect(result.valueCategoriesSeeded).toBeGreaterThan(0);
      expect(result.nationLevelsSeeded).toBeGreaterThan(0);
    });

    it('RBACをスキップできること', async () => {
      const { seedMasterData } = await import('@/db/seeds/master');

      const result = await seedMasterData({ verbose: false, skipRBAC: true });

      expect(result.rbacSeeded).toBe(false);
    });
  });

  describe('seedAll', () => {
    it('全てのシードを実行できること（ダミースキップ）', async () => {
      const { seedAll } = await import('@/db/seeds/runner');

      const result = await seedAll({ verbose: false, skipDummy: true, master: { skipRBAC: true } });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty('master');
      expect(result).toHaveProperty('duration');
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('ダミーデータをスキップできること', async () => {
      const { seedAll } = await import('@/db/seeds/runner');

      const result = await seedAll({ verbose: false, skipDummy: true, master: { skipRBAC: true } });

      expect(result.success).toBe(true);
      expect(result.dummy).toBeUndefined();
    });
  });

  describe('エクスポート確認', () => {
    it('index.ts から全てのエクスポートがされていること', async () => {
      const exports = await import('@/db/seeds/index');

      expect(exports).toHaveProperty('seedRBAC');
      expect(exports).toHaveProperty('seedMasterData');
      expect(exports).toHaveProperty('seedDummyData');
      expect(exports).toHaveProperty('seedAll');
      expect(exports).toHaveProperty('resetAndSeed');
    });
  });
});

describe('シードデータの整合性', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('WorkCategory の全ての値がシードされること', async () => {
    const { WorkCategory } = await import('@/db/constants');
    const { seedMasterData } = await import('@/db/seeds/master');

    const result = await seedMasterData({ verbose: false, skipRBAC: true });

    expect(result.workCategoriesSeeded).toBe(Object.values(WorkCategory).length);
  });

  it('ValueCategory の全ての値がシードされること', async () => {
    const { ValueCategory } = await import('@/db/constants');
    const { seedMasterData } = await import('@/db/seeds/master');

    const result = await seedMasterData({ verbose: false, skipRBAC: true });

    expect(result.valueCategoriesSeeded).toBe(Object.values(ValueCategory).length);
  });

  it('NationLevel の全ての値がシードされること', async () => {
    const { NationLevel } = await import('@/db/constants');
    const { seedMasterData } = await import('@/db/seeds/master');

    const result = await seedMasterData({ verbose: false, skipRBAC: true });

    expect(result.nationLevelsSeeded).toBe(Object.values(NationLevel).length);
  });
});

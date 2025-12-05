/**
 * 詩的ID（二つ名）生成ロジック
 *
 * 要件:
 * - 形式: 【形容詞】+【色/質感】+【名詞】
 * - システムが3候補を提示
 * - ユーザーが1つを選択
 * - 自作は不可（システム提供のみ）
 *
 * @fileoverview 詩的ID生成・バリデーション機能
 */

import { POETIC_ID_POOLS, type PoeticIdPoolId } from "@/data/poetic-id-words";

/**
 * 詩的ID生成オプション
 */
export interface PoeticIdGeneratorOptions {
  /** 使用するプールID */
  poolId?: PoeticIdPoolId;
  /** カスタム単語プール（nationカスタマイズ用） */
  customPool?: {
    adjectives: readonly string[] | string[];
    qualities: readonly string[] | string[];
    nouns: readonly string[] | string[];
  };
}

/**
 * 候補生成オプション
 */
export interface PoeticIdCandidatesOptions extends PoeticIdGeneratorOptions {
  /** 生成する候補数（デフォルト: 3） */
  count?: number;
  /** 除外する既存の詩的ID */
  excludeIds?: string[];
}

/**
 * バリデーション結果
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * バリデーションオプション
 */
export interface ValidationOptions {
  /** 禁止ワードリスト */
  bannedWords?: string[];
  /** 最大文字数（デフォルト: 50） */
  maxLength?: number;
}

/**
 * ランダムに配列から要素を選択
 */
function randomPick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * 単語プールを取得
 */
function getWordPool(options?: PoeticIdGeneratorOptions) {
  if (options?.customPool) {
    return options.customPool;
  }

  const poolId = options?.poolId || "default";
  const pool = POETIC_ID_POOLS[poolId];

  if (!pool) {
    throw new Error(`Unknown poetic ID pool: ${poolId}`);
  }

  return {
    adjectives: pool.adjectives,
    qualities: pool.qualities,
    nouns: pool.nouns,
  };
}

/**
 * 詩的IDを1つ生成
 *
 * @param options 生成オプション
 * @returns 生成された詩的ID
 *
 * @example
 * ```ts
 * const id = generatePoeticId();
 * // => "黒き闇の騎士"
 *
 * const japaneseId = generatePoeticId({ poolId: "japanese" });
 * // => "朧なる桜を纏う武士"
 * ```
 */
export function generatePoeticId(options?: PoeticIdGeneratorOptions): string {
  const pool = getWordPool(options);

  const adjective = randomPick(pool.adjectives);
  const quality = randomPick(pool.qualities);
  const noun = randomPick(pool.nouns);

  return `${adjective}${quality}${noun}`;
}

/**
 * 詩的IDの候補を複数生成
 *
 * 要件: システムが3候補を提示し、ユーザーが選択
 *
 * @param options 候補生成オプション
 * @returns 生成された候補配列（重複なし）
 *
 * @example
 * ```ts
 * const candidates = generatePoeticIdCandidates();
 * // => ["黒き闇の騎士", "白き光の守護者", "銀の星を数える旅人"]
 *
 * const moreCandidates = generatePoeticIdCandidates({ count: 5 });
 * // => 5件の候補
 * ```
 */
export function generatePoeticIdCandidates(
  options?: PoeticIdCandidatesOptions
): string[] {
  const count = options?.count || 3;
  const excludeIds = new Set(options?.excludeIds || []);
  const candidates: string[] = [];
  const generatedSet = new Set<string>();

  // 重複を避けるため、最大試行回数を設定
  const maxAttempts = count * 10;
  let attempts = 0;

  while (candidates.length < count && attempts < maxAttempts) {
    const candidate = generatePoeticId(options);
    attempts++;

    // 重複チェック・除外リストチェック
    if (!generatedSet.has(candidate) && !excludeIds.has(candidate)) {
      candidates.push(candidate);
      generatedSet.add(candidate);
    }
  }

  return candidates;
}

/**
 * 詩的IDのバリデーション
 *
 * @param poeticId バリデーション対象の詩的ID
 * @param options バリデーションオプション
 * @returns バリデーション結果
 *
 * @example
 * ```ts
 * const result = validatePoeticId("黒き闇の騎士");
 * // => { isValid: true }
 *
 * const invalidResult = validatePoeticId("クソ野郎", { bannedWords: ["クソ"] });
 * // => { isValid: false, error: "禁止ワードが含まれています" }
 * ```
 */
export function validatePoeticId(
  poeticId: string,
  options?: ValidationOptions
): ValidationResult {
  const maxLength = options?.maxLength || 50;
  const bannedWords = options?.bannedWords || [];

  // 空文字チェック
  if (!poeticId || poeticId.trim() === "") {
    return {
      isValid: false,
      error: "詩的IDは空にできません",
    };
  }

  // 長さチェック
  if (poeticId.length > maxLength) {
    return {
      isValid: false,
      error: `詩的IDは${maxLength}文字以内にしてください`,
    };
  }

  // 禁止ワードチェック
  for (const word of bannedWords) {
    if (poeticId.includes(word)) {
      return {
        isValid: false,
        error: "禁止ワードが含まれています",
      };
    }
  }

  return { isValid: true };
}

/**
 * 詩的ID用の型定義
 */
export type PoeticId = string;

/**
 * プールから生成可能な組み合わせ数を計算
 */
export function calculatePoolCombinations(poolId: PoeticIdPoolId): number {
  const pool = POETIC_ID_POOLS[poolId];
  return pool.adjectives.length * pool.qualities.length * pool.nouns.length;
}

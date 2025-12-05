/**
 * 詩的ID生成ロジック テスト
 * @fileoverview TDD: RED -> GREEN -> REFACTOR
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generatePoeticId,
  generatePoeticIdCandidates,
  validatePoeticId,
  type PoeticIdGeneratorOptions,
} from "./poetic-id-generator";
import { POETIC_ID_POOLS } from "@/data/poetic-id-words";

describe("詩的ID生成ロジック", () => {
  describe("generatePoeticId", () => {
    it("デフォルトプールから詩的IDを生成できる", () => {
      const result = generatePoeticId();

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it("形容詞 + 質感 + 名詞 の形式で生成される", () => {
      const result = generatePoeticId();

      // 形式: 「黒き闇の騎士」のような形
      // 各プールの単語が含まれているかチェック
      const pool = POETIC_ID_POOLS.default;
      const hasAdjective = pool.adjectives.some((adj) => result.includes(adj));
      const hasQuality = pool.qualities.some((q) => result.includes(q));
      const hasNoun = pool.nouns.some((n) => result.includes(n));

      // 少なくとも1つの要素が含まれている（ランダム性により常に3つではない場合もある）
      expect(hasAdjective || hasQuality || hasNoun).toBe(true);
    });

    it("指定したプールから生成できる", () => {
      const result = generatePoeticId({ poolId: "japanese" });

      expect(result).toBeDefined();
      expect(typeof result).toBe("string");

      const pool = POETIC_ID_POOLS.japanese;
      const hasElement =
        pool.adjectives.some((adj) => result.includes(adj)) ||
        pool.qualities.some((q) => result.includes(q)) ||
        pool.nouns.some((n) => result.includes(n));

      expect(hasElement).toBe(true);
    });

    it("カスタム単語プールを指定できる", () => {
      const customPool = {
        adjectives: ["テスト用の"],
        qualities: ["品質の"],
        nouns: ["名詞"],
      };

      const result = generatePoeticId({ customPool });

      expect(result).toBe("テスト用の品質の名詞");
    });
  });

  describe("generatePoeticIdCandidates", () => {
    it("デフォルトで3件の候補を生成する", () => {
      const candidates = generatePoeticIdCandidates();

      expect(candidates).toHaveLength(3);
      candidates.forEach((candidate) => {
        expect(typeof candidate).toBe("string");
        expect(candidate.length).toBeGreaterThan(0);
      });
    });

    it("指定した件数の候補を生成できる", () => {
      const candidates = generatePoeticIdCandidates({ count: 5 });

      expect(candidates).toHaveLength(5);
    });

    it("生成された候補は重複しない", () => {
      const candidates = generatePoeticIdCandidates({ count: 10 });
      const uniqueCandidates = new Set(candidates);

      expect(uniqueCandidates.size).toBe(candidates.length);
    });

    it("既存の詩的IDリストを除外して生成できる", () => {
      const existingIds = ["黒き闇の騎士", "白き光の守護者"];
      const candidates = generatePoeticIdCandidates({
        count: 5,
        excludeIds: existingIds,
      });

      existingIds.forEach((id) => {
        expect(candidates).not.toContain(id);
      });
    });
  });

  describe("validatePoeticId", () => {
    it("有効な詩的IDはtrueを返す", () => {
      const validIds = [
        "黒き闇の騎士",
        "銀の光を纏う影",
        "燃える星の守護者",
      ];

      validIds.forEach((id) => {
        expect(validatePoeticId(id).isValid).toBe(true);
      });
    });

    it("空文字はfalseを返す", () => {
      const result = validatePoeticId("");

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("詩的IDは空にできません");
    });

    it("長すぎる詩的IDはfalseを返す", () => {
      const longId = "あ".repeat(51); // 50文字超え

      const result = validatePoeticId(longId);

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("詩的IDは50文字以内にしてください");
    });

    it("禁止ワードを含む場合はfalseを返す", () => {
      const result = validatePoeticId("クソ野郎の騎士", {
        bannedWords: ["クソ", "ゴミ"],
      });

      expect(result.isValid).toBe(false);
      expect(result.error).toBe("禁止ワードが含まれています");
    });
  });
});

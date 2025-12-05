/**
 * 表示名システム
 *
 * @fileoverview 詩的ID生成、表示名解決、スタイル取得の統合モジュール
 */

// 詩的ID生成
export {
  generatePoeticId,
  generatePoeticIdCandidates,
  validatePoeticId,
  calculatePoolCombinations,
  type PoeticIdGeneratorOptions,
  type PoeticIdCandidatesOptions,
  type ValidationResult,
  type ValidationOptions,
  type PoeticId,
} from "./poetic-id-generator";

// 表示名解決
export {
  resolveDisplayName,
  formatDisplayName,
  getDisplayNameStyle,
  type DisplayNameContext,
  type RootAccountDisplayInfo,
  type ProfileDisplayInfo,
  type VenueRuleInfo,
  type ResolvedDisplayName,
  type DisplayNameStyle,
} from "./display-name-resolver";

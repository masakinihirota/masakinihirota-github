/**
 * 表示名解決ロジック
 *
 * 優先順位:
 * 1. 場所（掲示板等）のルール
 * 2. ユーザープロフィール設定
 * 3. ルートアカウント設定
 *
 * @fileoverview 表示名の解決・フォーマット・スタイル取得
 */

import {
  DisplayNameType,
  VenueDisplayRule,
  AnonymousIdDisplay,
} from "@/db/constants";

/**
 * ルートアカウント情報（表示名解決用）
 */
export interface RootAccountDisplayInfo {
  realName: string | null;
  realNameVerified: boolean;
  defaultDisplayNameType: DisplayNameType | string;
}

/**
 * プロフィール情報（表示名解決用）
 */
export interface ProfileDisplayInfo {
  name: string;
  poeticId: string | null;
  displayNameType: DisplayNameType | string;
  isIdPublic: boolean;
}

/**
 * 場所ルール情報
 */
export interface VenueRuleInfo {
  ruleType: VenueDisplayRule | string;
  unifiedNetName?: string | null;
  anonymousDefaultName: string;
  showAnonymousId: AnonymousIdDisplay | string;
}

/**
 * 表示名解決コンテキスト
 */
export interface DisplayNameContext {
  rootAccount: RootAccountDisplayInfo;
  profile: ProfileDisplayInfo;
  venueRule: VenueRuleInfo | null;
}

/**
 * 解決された表示名
 */
export interface ResolvedDisplayName {
  /** 表示する名前 */
  displayName: string;
  /** 表示名タイプ */
  type: DisplayNameType | string;
  /** 詩的ID（nullの場合は表示しない） */
  poeticId: string | null;
  /** 本人確認済みかどうか */
  isVerified: boolean;
  /** 参加可能かどうか（場所ルールによる制限） */
  canParticipate: boolean;
  /** 参加不可の理由 */
  participationError?: string;
  /** 匿名ID（匿名表示時のユニークID） */
  anonymousId?: string;
}

/**
 * 表示名スタイル
 */
export interface DisplayNameStyle {
  /** テキスト色 */
  textColor: "oasis" | "default";
  /** 専用アイコン表示 */
  hasIcon: boolean;
  /** 詩的IDの透明度（0-1） */
  poeticIdOpacity: number;
}

/**
 * 表示名を解決する
 *
 * 優先順位に従って、最終的に表示する名前を決定する。
 *
 * @param context 表示名解決コンテキスト
 * @returns 解決された表示名
 *
 * @example
 * ```ts
 * const resolved = resolveDisplayName({
 *   rootAccount: { realName: "山田太郎", realNameVerified: true, ... },
 *   profile: { name: "ヤマタロウ", poeticId: null, ... },
 *   venueRule: null,
 * });
 * // => { displayName: "山田太郎", type: "blue_name", ... }
 * ```
 */
export function resolveDisplayName(
  context: DisplayNameContext
): ResolvedDisplayName {
  const { rootAccount, profile, venueRule } = context;

  // 場所ルールによる強制がある場合、最優先で処理
  if (venueRule) {
    return resolveWithVenueRule(context);
  }

  // プロフィール設定に基づいて解決
  return resolveByDisplayNameType(
    profile.displayNameType as DisplayNameType,
    rootAccount,
    profile
  );
}

/**
 * 場所ルールに基づいて表示名を解決
 */
function resolveWithVenueRule(
  context: DisplayNameContext
): ResolvedDisplayName {
  const { rootAccount, profile, venueRule } = context;

  if (!venueRule) {
    throw new Error("venueRule is required");
  }

  switch (venueRule.ruleType) {
    case VenueDisplayRule.Free:
      // 自由選択: プロフィール設定を使用
      return resolveByDisplayNameType(
        profile.displayNameType as DisplayNameType,
        rootAccount,
        profile
      );

    case VenueDisplayRule.RealNameRequired:
      // 実名強制
      if (!rootAccount.realName) {
        return {
          displayName: "",
          type: DisplayNameType.Anonymous,
          poeticId: null,
          isVerified: false,
          canParticipate: false,
          participationError: "実名の登録が必要です",
        };
      }
      return {
        displayName: rootAccount.realName,
        type: rootAccount.realNameVerified
          ? DisplayNameType.BlueName
          : DisplayNameType.UnverifiedRealName,
        poeticId: rootAccount.realNameVerified ? null : profile.poeticId,
        isVerified: rootAccount.realNameVerified,
        canParticipate: true,
      };

    case VenueDisplayRule.VerifiedOnly:
      // 認証済み実名限定
      if (!rootAccount.realNameVerified) {
        return {
          displayName: "",
          type: DisplayNameType.Anonymous,
          poeticId: null,
          isVerified: false,
          canParticipate: false,
          participationError: "本人確認済みの実名が必要です",
        };
      }
      return {
        displayName: rootAccount.realName!,
        type: DisplayNameType.BlueName,
        poeticId: null,
        isVerified: true,
        canParticipate: true,
      };

    case VenueDisplayRule.AnonymousOnly:
      // 匿名限定
      return {
        displayName: venueRule.anonymousDefaultName || "匿名",
        type: DisplayNameType.Anonymous,
        poeticId: null,
        isVerified: false,
        canParticipate: true,
      };

    case VenueDisplayRule.UnifiedNetName:
      // 統一ネットネーム
      return {
        displayName: venueRule.unifiedNetName || profile.name,
        type: DisplayNameType.NetName,
        poeticId: null,
        isVerified: false,
        canParticipate: true,
      };

    default:
      // デフォルト: プロフィール設定を使用
      return resolveByDisplayNameType(
        profile.displayNameType as DisplayNameType,
        rootAccount,
        profile
      );
  }
}

/**
 * 表示名タイプに基づいて解決
 */
function resolveByDisplayNameType(
  type: DisplayNameType,
  rootAccount: RootAccountDisplayInfo,
  profile: ProfileDisplayInfo
): ResolvedDisplayName {
  switch (type) {
    case DisplayNameType.BlueName:
      if (!rootAccount.realNameVerified || !rootAccount.realName) {
        // 認証済み実名がない場合はネットネームにフォールバック
        return {
          displayName: profile.name,
          type: DisplayNameType.NetName,
          poeticId: profile.poeticId,
          isVerified: false,
          canParticipate: true,
        };
      }
      return {
        displayName: rootAccount.realName,
        type: DisplayNameType.BlueName,
        poeticId: null,
        isVerified: true,
        canParticipate: true,
      };

    case DisplayNameType.UnverifiedRealName:
      if (!rootAccount.realName) {
        // 実名がない場合はネットネームにフォールバック
        return {
          displayName: profile.name,
          type: DisplayNameType.NetName,
          poeticId: profile.poeticId,
          isVerified: false,
          canParticipate: true,
        };
      }
      return {
        displayName: rootAccount.realName,
        type: DisplayNameType.UnverifiedRealName,
        poeticId: profile.poeticId,
        isVerified: rootAccount.realNameVerified,
        canParticipate: true,
      };

    case DisplayNameType.NetName:
      return {
        displayName: profile.name,
        type: DisplayNameType.NetName,
        poeticId: profile.poeticId,
        isVerified: false,
        canParticipate: true,
      };

    case DisplayNameType.Anonymous:
      return {
        displayName: "匿名",
        type: DisplayNameType.Anonymous,
        poeticId: null,
        isVerified: false,
        canParticipate: true,
      };

    default:
      // デフォルトはネットネーム
      return {
        displayName: profile.name,
        type: DisplayNameType.NetName,
        poeticId: profile.poeticId,
        isVerified: false,
        canParticipate: true,
      };
  }
}

/**
 * 表示名をフォーマットする
 *
 * @param resolved 解決された表示名
 * @returns フォーマットされた表示文字列
 *
 * @example
 * ```ts
 * formatDisplayName({ displayName: "ツメニト", poeticId: "銀の光を纏う影", ... })
 * // => "ツメニト@銀の光を纏う影"
 *
 * formatDisplayName({ displayName: "山田太郎", poeticId: null, type: "blue_name", ... })
 * // => "山田太郎"
 * ```
 */
export function formatDisplayName(resolved: ResolvedDisplayName): string {
  // Blueネームは詩的IDなし
  if (resolved.type === DisplayNameType.BlueName || !resolved.poeticId) {
    return resolved.displayName;
  }

  // 詩的ID付きの場合は @ で結合
  return `${resolved.displayName}@${resolved.poeticId}`;
}

/**
 * 表示名タイプに応じたスタイルを取得
 *
 * @param type 表示名タイプ
 * @returns スタイル情報
 */
export function getDisplayNameStyle(
  type: DisplayNameType | string
): DisplayNameStyle {
  switch (type) {
    case DisplayNameType.BlueName:
      return {
        textColor: "oasis",
        hasIcon: true,
        poeticIdOpacity: 1,
      };

    case DisplayNameType.UnverifiedRealName:
      return {
        textColor: "default",
        hasIcon: false,
        poeticIdOpacity: 0.5, // 詩的ID半透明
      };

    case DisplayNameType.NetName:
      return {
        textColor: "default",
        hasIcon: false,
        poeticIdOpacity: 1,
      };

    case DisplayNameType.Anonymous:
      return {
        textColor: "default",
        hasIcon: false,
        poeticIdOpacity: 1,
      };

    default:
      return {
        textColor: "default",
        hasIcon: false,
        poeticIdOpacity: 1,
      };
  }
}

/**
 * 表示名解決ロジック テスト
 * @fileoverview TDD: RED -> GREEN -> REFACTOR
 */

import { describe, it, expect } from "vitest";
import {
  resolveDisplayName,
  formatDisplayName,
  getDisplayNameStyle,
  type DisplayNameContext,
  type ResolvedDisplayName,
} from "./display-name-resolver";
import { DisplayNameType, VenueDisplayRule } from "@/db/constants";

describe("表示名解決ロジック", () => {
  describe("resolveDisplayName", () => {
    it("認証済み実名（Blueネーム）を正しく解決する", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: "山田太郎",
          realNameVerified: true,
          defaultDisplayNameType: DisplayNameType.BlueName,
        },
        profile: {
          name: "ヤマタロウ",
          poeticId: null,
          displayNameType: DisplayNameType.BlueName,
          isIdPublic: true,
        },
        venueRule: null,
      };

      const result = resolveDisplayName(context);

      expect(result.displayName).toBe("山田太郎");
      expect(result.type).toBe(DisplayNameType.BlueName);
      expect(result.poeticId).toBeNull();
      expect(result.isVerified).toBe(true);
    });

    it("未認証実名は詩的ID付きで解決する", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: "大谷翔平",
          realNameVerified: false,
          defaultDisplayNameType: DisplayNameType.UnverifiedRealName,
        },
        profile: {
          name: "オオタニ",
          poeticId: "黒き闇の白い燭台",
          displayNameType: DisplayNameType.UnverifiedRealName,
          isIdPublic: true,
        },
        venueRule: null,
      };

      const result = resolveDisplayName(context);

      expect(result.displayName).toBe("大谷翔平");
      expect(result.type).toBe(DisplayNameType.UnverifiedRealName);
      expect(result.poeticId).toBe("黒き闇の白い燭台");
      expect(result.isVerified).toBe(false);
    });

    it("ネットネームは詩的ID付きで解決する", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: null,
          realNameVerified: false,
          defaultDisplayNameType: DisplayNameType.NetName,
        },
        profile: {
          name: "ツメニト",
          poeticId: "銀の光を纏う影",
          displayNameType: DisplayNameType.NetName,
          isIdPublic: true,
        },
        venueRule: null,
      };

      const result = resolveDisplayName(context);

      expect(result.displayName).toBe("ツメニト");
      expect(result.type).toBe(DisplayNameType.NetName);
      expect(result.poeticId).toBe("銀の光を纏う影");
      expect(result.isVerified).toBe(false);
    });

    it("匿名は詩的IDなしで解決する", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: null,
          realNameVerified: false,
          defaultDisplayNameType: DisplayNameType.Anonymous,
        },
        profile: {
          name: "ユーザー",
          poeticId: null,
          displayNameType: DisplayNameType.Anonymous,
          isIdPublic: false,
        },
        venueRule: null,
      };

      const result = resolveDisplayName(context);

      expect(result.displayName).toBe("匿名");
      expect(result.type).toBe(DisplayNameType.Anonymous);
      expect(result.poeticId).toBeNull();
    });

    it("場所ルール（実名強制）が優先される", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: "佐藤一郎",
          realNameVerified: false,
          defaultDisplayNameType: DisplayNameType.NetName,
        },
        profile: {
          name: "サトウ",
          poeticId: "燃える星の守護者",
          displayNameType: DisplayNameType.NetName,
          isIdPublic: true,
        },
        venueRule: {
          ruleType: VenueDisplayRule.RealNameRequired,
          anonymousDefaultName: "匿名",
          showAnonymousId: "optional",
        },
      };

      const result = resolveDisplayName(context);

      // 実名強制なので、実名が表示される
      expect(result.displayName).toBe("佐藤一郎");
      expect(result.type).toBe(DisplayNameType.UnverifiedRealName);
    });

    it("場所ルール（匿名限定）が優先される", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: "田中花子",
          realNameVerified: true,
          defaultDisplayNameType: DisplayNameType.BlueName,
        },
        profile: {
          name: "ハナコ",
          poeticId: null,
          displayNameType: DisplayNameType.BlueName,
          isIdPublic: true,
        },
        venueRule: {
          ruleType: VenueDisplayRule.AnonymousOnly,
          anonymousDefaultName: "名無しさん",
          showAnonymousId: "hidden",
        },
      };

      const result = resolveDisplayName(context);

      // 匿名限定なので、カスタム匿名名が表示される
      expect(result.displayName).toBe("名無しさん");
      expect(result.type).toBe(DisplayNameType.Anonymous);
    });

    it("実名なしで実名強制の場所には参加不可を返す", () => {
      const context: DisplayNameContext = {
        rootAccount: {
          realName: null,
          realNameVerified: false,
          defaultDisplayNameType: DisplayNameType.NetName,
        },
        profile: {
          name: "ユーザー",
          poeticId: "夢見る月",
          displayNameType: DisplayNameType.NetName,
          isIdPublic: true,
        },
        venueRule: {
          ruleType: VenueDisplayRule.RealNameRequired,
          anonymousDefaultName: "匿名",
          showAnonymousId: "optional",
        },
      };

      const result = resolveDisplayName(context);

      expect(result.canParticipate).toBe(false);
      expect(result.participationError).toBe("実名の登録が必要です");
    });
  });

  describe("formatDisplayName", () => {
    it("Blueネームはそのまま表示", () => {
      const resolved: ResolvedDisplayName = {
        displayName: "山田太郎",
        type: DisplayNameType.BlueName,
        poeticId: null,
        isVerified: true,
        canParticipate: true,
      };

      expect(formatDisplayName(resolved)).toBe("山田太郎");
    });

    it("未認証実名は詩的ID付きで表示", () => {
      const resolved: ResolvedDisplayName = {
        displayName: "大谷翔平",
        type: DisplayNameType.UnverifiedRealName,
        poeticId: "黒き闇の白い燭台",
        isVerified: false,
        canParticipate: true,
      };

      expect(formatDisplayName(resolved)).toBe("大谷翔平@黒き闇の白い燭台");
    });

    it("ネットネームは詩的ID付きで表示", () => {
      const resolved: ResolvedDisplayName = {
        displayName: "ツメニト",
        type: DisplayNameType.NetName,
        poeticId: "銀の光を纏う影",
        isVerified: false,
        canParticipate: true,
      };

      expect(formatDisplayName(resolved)).toBe("ツメニト@銀の光を纏う影");
    });
  });

  describe("getDisplayNameStyle", () => {
    it("Blueネームはオアシス色スタイル", () => {
      const style = getDisplayNameStyle(DisplayNameType.BlueName);

      expect(style.textColor).toBe("oasis");
      expect(style.hasIcon).toBe(true);
    });

    it("未認証実名は通常スタイル（詩的ID半透明）", () => {
      const style = getDisplayNameStyle(DisplayNameType.UnverifiedRealName);

      expect(style.textColor).toBe("default");
      expect(style.poeticIdOpacity).toBe(0.5);
    });

    it("ネットネームは通常スタイル", () => {
      const style = getDisplayNameStyle(DisplayNameType.NetName);

      expect(style.textColor).toBe("default");
      expect(style.poeticIdOpacity).toBe(1);
    });

    it("匿名は通常スタイル", () => {
      const style = getDisplayNameStyle(DisplayNameType.Anonymous);

      expect(style.textColor).toBe("default");
      expect(style.hasIcon).toBe(false);
    });
  });
});

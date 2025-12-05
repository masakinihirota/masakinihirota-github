/**
 * DisplayName コンポーネント テスト
 * @fileoverview TDD: RED -> GREEN -> REFACTOR
 * @vitest-environment jsdom
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DisplayName } from "./DisplayName";
import { DisplayNameType } from "@/db/constants";

describe("DisplayName コンポーネント", () => {
  describe("Blueネーム表示", () => {
    it("認証済み実名を青色で表示する", () => {
      render(
        <DisplayName
          displayName="山田太郎"
          type={DisplayNameType.BlueName}
          isVerified={true}
        />
      );

      const nameElement = screen.getByText("山田太郎");
      expect(nameElement).toBeInTheDocument();
      expect(nameElement).toHaveClass("text-oasis");
    });

    it("認証済みアイコンを表示する", () => {
      render(
        <DisplayName
          displayName="山田太郎"
          type={DisplayNameType.BlueName}
          isVerified={true}
        />
      );

      const icon = screen.getByTestId("verified-icon");
      expect(icon).toBeInTheDocument();
    });

    it("詩的IDは表示されない", () => {
      render(
        <DisplayName
          displayName="山田太郎"
          type={DisplayNameType.BlueName}
          poeticId="黒き闇の騎士"
          isVerified={true}
        />
      );

      expect(screen.queryByText("黒き闇の騎士")).not.toBeInTheDocument();
    });
  });

  describe("未認証実名表示", () => {
    it("実名と詩的IDを表示する", () => {
      render(
        <DisplayName
          displayName="大谷翔平"
          type={DisplayNameType.UnverifiedRealName}
          poeticId="黒き闇の白い燭台"
          isVerified={false}
        />
      );

      expect(screen.getByText("大谷翔平")).toBeInTheDocument();
      expect(screen.getByText("@黒き闇の白い燭台")).toBeInTheDocument();
    });

    it("詩的IDは半透明で表示する", () => {
      render(
        <DisplayName
          displayName="大谷翔平"
          type={DisplayNameType.UnverifiedRealName}
          poeticId="黒き闇の白い燭台"
          isVerified={false}
        />
      );

      const poeticIdElement = screen.getByText("@黒き闇の白い燭台");
      expect(poeticIdElement).toHaveClass("opacity-50");
    });
  });

  describe("ネットネーム表示", () => {
    it("ネットネームと詩的IDを表示する", () => {
      render(
        <DisplayName
          displayName="ツメニト"
          type={DisplayNameType.NetName}
          poeticId="銀の光を纏う影"
          isVerified={false}
        />
      );

      expect(screen.getByText("ツメニト")).toBeInTheDocument();
      expect(screen.getByText("@銀の光を纏う影")).toBeInTheDocument();
    });

    it("詩的IDは通常の透明度で表示する", () => {
      render(
        <DisplayName
          displayName="ツメニト"
          type={DisplayNameType.NetName}
          poeticId="銀の光を纏う影"
          isVerified={false}
        />
      );

      const poeticIdElement = screen.getByText("@銀の光を纏う影");
      expect(poeticIdElement).not.toHaveClass("opacity-50");
    });
  });

  describe("匿名表示", () => {
    it("匿名名を表示する", () => {
      render(
        <DisplayName
          displayName="匿名"
          type={DisplayNameType.Anonymous}
          isVerified={false}
        />
      );

      expect(screen.getByText("匿名")).toBeInTheDocument();
    });

    it("詩的IDは表示されない", () => {
      render(
        <DisplayName
          displayName="匿名"
          type={DisplayNameType.Anonymous}
          poeticId="何かの詩的ID"
          isVerified={false}
        />
      );

      expect(screen.queryByText("何かの詩的ID")).not.toBeInTheDocument();
    });
  });

  describe("サイズバリエーション", () => {
    it("small サイズで表示できる", () => {
      render(
        <DisplayName
          displayName="テスト"
          type={DisplayNameType.NetName}
          size="small"
          isVerified={false}
        />
      );

      const nameElement = screen.getByText("テスト");
      expect(nameElement).toHaveClass("text-sm");
    });

    it("large サイズで表示できる", () => {
      render(
        <DisplayName
          displayName="テスト"
          type={DisplayNameType.NetName}
          size="large"
          isVerified={false}
        />
      );

      const nameElement = screen.getByText("テスト");
      expect(nameElement).toHaveClass("text-lg");
    });
  });
});

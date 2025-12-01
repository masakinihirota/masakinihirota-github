/**
 * MatchingTop コンポーネント テスト
 *
 * TDD RED Phase: 最初の失敗テストを 1 つだけ追加
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - マッチングチケット残数を表示する
 * - 「マッチングを開始する」ボタンを表示する
 * - モード選択（通常/プレミアム）を提供する
 * - マッチングの説明を表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchingTop } from "./MatchingTop";

const mockStatus = {
  ticketCount: 5,
  lastMatchDate: "2025-11-30",
  hasProfile: true,
};

describe("MatchingTop", () => {
  it("マッチング画面のタイトルを表示する", () => {
    render(<MatchingTop status={mockStatus} />);

    expect(screen.getByRole("heading", { name: "マッチング" })).toBeInTheDocument();
  });

  it("チケット残数を表示する", () => {
    render(<MatchingTop status={mockStatus} />);

    expect(screen.getByText("5枚")).toBeInTheDocument();
  });

  it("プロフィール未作成の場合は警告を表示する", () => {
    const statusWithoutProfile = { ...mockStatus, hasProfile: false };
    render(<MatchingTop status={statusWithoutProfile} />);

    expect(screen.getByText("プロフィールを作成してください")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "プロフィール作成" })).toBeInTheDocument();
  });

  it("マッチングモードの選択肢を表示する", () => {
    render(<MatchingTop status={mockStatus} />);

    expect(screen.getByText("💫 通常マッチング")).toBeInTheDocument();
    expect(screen.getByText("✨ プレミアムマッチング")).toBeInTheDocument();
  });
});

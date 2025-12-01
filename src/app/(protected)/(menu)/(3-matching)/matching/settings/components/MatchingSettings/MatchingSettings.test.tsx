/**
 * MatchingSettings コンポーネント テスト
 *
 * TDD RED Phase: マッチング設定画面のテスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - 価値観の重要度設定を表示する
 * - 作品ジャンルの優先度設定を表示する
 * - スキルの絞り込み設定を表示する
 * - 保存ボタンとマッチング開始ボタンを表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchingSettings } from "./MatchingSettings";

const mockSettings = {
  values: [
    { id: "value-1", name: "創造性", importance: 80 },
    { id: "value-2", name: "誠実さ", importance: 70 },
  ],
  genres: [
    { id: "genre-1", name: "フィクション", selected: true },
    { id: "genre-2", name: "ファンタジー", selected: true },
    { id: "genre-3", name: "SF", selected: false },
  ],
  skills: [
    { id: "skill-1", name: "プログラミング", selected: true },
    { id: "skill-2", name: "デザイン", selected: false },
  ],
  region: "日本",
  generation: "1990年代",
};

describe("MatchingSettings", () => {
  it("設定画面のタイトルを表示する", () => {
    render(<MatchingSettings settings={mockSettings} />);

    expect(screen.getByRole("heading", { name: /マッチング設定/i })).toBeInTheDocument();
  });

  it("価値観の重要度セクションを表示する", () => {
    render(<MatchingSettings settings={mockSettings} />);

    expect(screen.getByRole("heading", { name: /価値観の重要度/i })).toBeInTheDocument();
    expect(screen.getByText("創造性")).toBeInTheDocument();
    expect(screen.getByText("誠実さ")).toBeInTheDocument();
  });

  it("作品ジャンルの優先度セクションを表示する", () => {
    render(<MatchingSettings settings={mockSettings} />);

    expect(screen.getByRole("heading", { name: /作品ジャンルの優先度/i })).toBeInTheDocument();
    expect(screen.getByText("フィクション")).toBeInTheDocument();
  });

  it("保存ボタンとマッチング開始ボタンを表示する", () => {
    render(<MatchingSettings settings={mockSettings} />);

    expect(screen.getByRole("button", { name: /保存/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /マッチング開始/i })).toBeInTheDocument();
  });
});

/**
 * MatchingResultDetail コンポーネント テスト
 *
 * TDD RED Phase: マッチング結果詳細のテスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - 候補者の基本情報を表示する
 * - 総合相性スコアを表示する
 * - 相性分析（共通点リスト）を表示する
 * - アクションボタン（いいね、ブロック）を表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchingResultDetail } from "./MatchingResultDetail";

const mockResult = {
  id: "result-1",
  candidateName: "田中太郎",
  candidateAvatar: "/avatars/tanaka.jpg",
  candidateBio: "Web開発者です。趣味は読書と映画鑑賞。",
  compatibilityScore: 85,
  analysisCategories: [
    { name: "価値観", score: 90 },
    { name: "趣味", score: 80 },
    { name: "ライフスタイル", score: 75 },
  ],
  commonPoints: ["価値観が似ている", "同じ趣味", "好きな映画が同じ"],
  aiComment: "二人は価値観において非常に相性が良いです。特に、創造性を大切にする点が共通しています。",
  suggestedTopics: ["好きな映画について", "休日の過ごし方"],
  matchedAt: "2025-12-01",
};

describe("MatchingResultDetail", () => {
  it("候補者の名前と基本情報を表示する", () => {
    render(<MatchingResultDetail result={mockResult} />);

    expect(screen.getByText("田中太郎")).toBeInTheDocument();
    expect(screen.getByText(/Web開発者です/)).toBeInTheDocument();
  });

  it("総合相性スコアを表示する", () => {
    render(<MatchingResultDetail result={mockResult} />);

    expect(screen.getByText(/85/)).toBeInTheDocument();
    expect(screen.getByText("総合相性スコア")).toBeInTheDocument();
  });

  it("AIコメントを表示する", () => {
    render(<MatchingResultDetail result={mockResult} />);

    expect(screen.getByText(/二人は価値観において非常に相性が良いです/)).toBeInTheDocument();
  });

  it("アクションボタンを表示する", () => {
    render(<MatchingResultDetail result={mockResult} />);

    expect(screen.getByRole("button", { name: /いいね/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ブロック/i })).toBeInTheDocument();
  });
});

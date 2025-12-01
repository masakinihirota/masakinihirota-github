/**
 * MatchingResults コンポーネント テスト
 *
 * TDD RED Phase: マッチング結果一覧のテスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - マッチング結果のリストを表示する
 * - 各結果の相性スコアを表示する
 * - いいね/スキップボタンを表示する
 * - 空状態のメッセージを表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MatchingResults } from "./MatchingResults";

const mockResults = [
  {
    id: "result-1",
    candidateName: "田中太郎",
    candidateAvatar: "/avatars/tanaka.jpg",
    compatibilityScore: 85,
    commonPoints: ["価値観が似ている", "同じ趣味"],
    matchedAt: "2025-12-01",
  },
  {
    id: "result-2",
    candidateName: "山田花子",
    candidateAvatar: "/avatars/yamada.jpg",
    compatibilityScore: 72,
    commonPoints: ["好きな映画が同じ"],
    matchedAt: "2025-12-01",
  },
];

describe("MatchingResults", () => {
  it("マッチング結果のタイトルを表示する", () => {
    render(<MatchingResults results={mockResults} />);

    expect(screen.getByRole("heading", { name: /マッチング結果/i })).toBeInTheDocument();
  });

  it("候補者の名前と相性スコアを表示する", () => {
    render(<MatchingResults results={mockResults} />);

    expect(screen.getByText("田中太郎")).toBeInTheDocument();
    expect(screen.getByText(/85/)).toBeInTheDocument();
    expect(screen.getByText("山田花子")).toBeInTheDocument();
    expect(screen.getByText(/72/)).toBeInTheDocument();
  });

  it("各候補者にアクションボタンを表示する", () => {
    render(<MatchingResults results={mockResults} />);

    const likeButtons = screen.getAllByRole("button", { name: /いいね/i });
    const skipButtons = screen.getAllByRole("button", { name: /スキップ/i });

    expect(likeButtons).toHaveLength(2);
    expect(skipButtons).toHaveLength(2);
  });

  it("結果が空の場合は空状態のメッセージを表示する", () => {
    render(<MatchingResults results={[]} />);

    expect(screen.getByText(/マッチング結果がありません/i)).toBeInTheDocument();
  });
});

/**
 * 価値観詳細ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueDetail } from "./components/ValueDetail";

const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "人生",
  description: "幸福の定義について考えましょう",
  creator: "田中太郎",
  createdAt: "2025-01-01",
  answerCount: 42,
  myAnswer: undefined,
  answers: [],
};

describe("ValueDetailPage", () => {
  it("価値観詳細をレンダリングする", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByRole("heading", { name: "あなたにとって幸せとは？" })).toBeInTheDocument();
  });

  it("一覧に戻るリンクを表示する", () => {
    render(<ValueDetail value={mockValue} />);

    const backLink = screen.getByRole("link", { name: "一覧に戻る" });
    expect(backLink).toHaveAttribute("href", "/values");
  });
});

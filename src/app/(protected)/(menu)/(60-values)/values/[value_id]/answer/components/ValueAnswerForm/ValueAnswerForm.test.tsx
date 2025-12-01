/**
 * ValueAnswerForm コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ValueAnswerForm } from "./ValueAnswerForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "人生",
  description: "幸福の定義について考えましょう",
  myAnswer: undefined,
};

describe("ValueAnswerForm", () => {
  it("回答フォームのタイトルを表示する", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByRole("heading", { name: "価値観に回答" })).toBeInTheDocument();
  });

  it("質問のタイトルを表示する", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByText("あなたにとって幸せとは？")).toBeInTheDocument();
  });

  it("カテゴリを表示する", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByText("人生")).toBeInTheDocument();
  });

  it("回答入力フィールドを表示する", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByLabelText(/回答を入力/)).toBeInTheDocument();
  });

  it("未回答の場合は「回答する」ボタンを表示する", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByRole("button", { name: "回答する" })).toBeInTheDocument();
  });

  it("回答済みの場合は「回答を更新」ボタンを表示する", () => {
    const valueWithAnswer = { ...mockValue, myAnswer: "既存の回答" };

    render(<ValueAnswerForm value={valueWithAnswer} />);

    expect(screen.getByRole("button", { name: "回答を更新" })).toBeInTheDocument();
  });
});

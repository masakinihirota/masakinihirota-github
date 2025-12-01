/**
 * ValueEditForm コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ValueEditForm } from "./ValueEditForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "life",
  description: "幸福の定義について考えましょう",
};

describe("ValueEditForm", () => {
  it("編集フォームのタイトルを表示する", () => {
    render(<ValueEditForm value={mockValue} />);

    expect(screen.getByRole("heading", { name: "価値観を編集" })).toBeInTheDocument();
  });

  it("既存の値を表示する", () => {
    render(<ValueEditForm value={mockValue} />);

    expect(screen.getByDisplayValue("あなたにとって幸せとは？")).toBeInTheDocument();
    expect(screen.getByDisplayValue("幸福の定義について考えましょう")).toBeInTheDocument();
  });

  it("保存ボタンを表示する", () => {
    render(<ValueEditForm value={mockValue} />);

    expect(screen.getByRole("button", { name: "保存する" })).toBeInTheDocument();
  });

  it("キャンセルリンクを表示する", () => {
    render(<ValueEditForm value={mockValue} />);

    const cancelLinks = screen.getAllByRole("link", { name: "キャンセル" });
    expect(cancelLinks.length).toBeGreaterThan(0);
  });
});

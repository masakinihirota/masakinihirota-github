/**
 * ValueCreateForm コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ValueCreateForm } from "./ValueCreateForm";

// Next.js router のモック
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("ValueCreateForm", () => {
  it("価値観作成フォームのタイトルを表示する", () => {
    render(<ValueCreateForm />);

    expect(screen.getByRole("heading", { name: "価値観を作成" })).toBeInTheDocument();
  });

  it("質問入力フィールドを表示する", () => {
    render(<ValueCreateForm />);

    expect(screen.getByLabelText(/質問/)).toBeInTheDocument();
  });

  it("補足説明入力フィールドを表示する", () => {
    render(<ValueCreateForm />);

    expect(screen.getByLabelText(/補足説明/)).toBeInTheDocument();
  });

  it("作成ボタンを表示する", () => {
    render(<ValueCreateForm />);

    expect(screen.getByRole("button", { name: "作成する" })).toBeInTheDocument();
  });

  it("キャンセルリンクを表示する", () => {
    render(<ValueCreateForm />);

    const cancelLinks = screen.getAllByRole("link", { name: "キャンセル" });
    expect(cancelLinks.length).toBeGreaterThan(0);
    expect(cancelLinks[0]).toHaveAttribute("href", "/values");
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillCreateForm } from "./SkillCreateForm";

// Next.js のモック
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("SkillCreateForm", () => {
  it("スキル登録フォームのタイトルを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByText("スキル登録")).toBeInTheDocument();
  });

  it("スキル名入力フィールドを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByLabelText(/スキル名/i)).toBeInTheDocument();
  });

  it("カテゴリ選択を表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByText("カテゴリを選択")).toBeInTheDocument();
  });

  it("説明入力フィールドを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByLabelText(/説明/i)).toBeInTheDocument();
  });

  it("公式サイトURL入力フィールドを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByLabelText(/公式サイトURL/i)).toBeInTheDocument();
  });

  it("登録ボタンを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  it("キャンセルリンクを表示する", () => {
    render(<SkillCreateForm />);
    expect(screen.getByRole("link", { name: "キャンセル" })).toBeInTheDocument();
  });
});

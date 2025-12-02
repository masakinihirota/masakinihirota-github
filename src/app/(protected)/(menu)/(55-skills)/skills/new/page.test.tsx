// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillCreatePage from "./page";

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

describe("SkillCreatePage", () => {
  it("スキル登録ページをレンダリングする", () => {
    render(<SkillCreatePage />);
    expect(screen.getByText("スキル登録")).toBeInTheDocument();
  });

  it("スキル名入力フィールドを表示する", () => {
    render(<SkillCreatePage />);
    expect(screen.getByLabelText(/スキル名/i)).toBeInTheDocument();
  });

  it("登録ボタンを表示する", () => {
    render(<SkillCreatePage />);
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });
});

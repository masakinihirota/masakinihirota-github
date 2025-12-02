// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillsPage from "./page";

// Next.js Link をモック
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SkillsPage", () => {
  it("スキル一覧ページをレンダリングする", () => {
    render(<SkillsPage />);
    expect(screen.getByText("スキル一覧")).toBeInTheDocument();
  });

  it("スキルのリストを表示する", () => {
    render(<SkillsPage />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });

  it("スキル登録リンクを表示する", () => {
    render(<SkillsPage />);
    const link = screen.getByRole("link", { name: /スキル登録/i });
    expect(link).toHaveAttribute("href", "/skills/new");
  });
});

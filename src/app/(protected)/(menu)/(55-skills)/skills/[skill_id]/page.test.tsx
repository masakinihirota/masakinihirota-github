// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillDetailPage from "./page";

// Next.js Link をモック
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SkillDetailPage", () => {
  it("スキル詳細をレンダリングする", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillDetailPage({ params }));
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("一覧に戻るリンクを表示する", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillDetailPage({ params }));
    expect(screen.getByText("一覧に戻る")).toBeInTheDocument();
  });

  it("習得ボタンを表示する", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillDetailPage({ params }));
    expect(screen.getByRole("button", { name: /習得する/i })).toBeInTheDocument();
  });
});

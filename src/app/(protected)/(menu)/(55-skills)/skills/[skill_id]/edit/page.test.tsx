// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillEditPage from "./page";

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

describe("SkillEditPage", () => {
  it("スキル編集ページをレンダリングする", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillEditPage({ params }));
    expect(screen.getByText("スキル編集")).toBeInTheDocument();
  });

  it("既存のスキル名を表示する", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillEditPage({ params }));
    expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
  });

  it("保存ボタンを表示する", async () => {
    const params = Promise.resolve({ skill_id: "1" });
    render(await SkillEditPage({ params }));
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });
});

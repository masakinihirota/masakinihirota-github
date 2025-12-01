// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillList, Skill } from "./SkillList";

// Next.js Link をモック
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SkillList", () => {
  const mockSkills: Skill[] = [
    {
      id: "1",
      name: "TypeScript",
      category: "プログラミング",
      description: "型安全なJavaScript",
      userCount: 150,
    },
    {
      id: "2",
      name: "Figma",
      category: "デザイン",
      description: "UIデザインツール",
      userCount: 80,
    },
  ];

  it("スキル一覧のタイトルを表示する", () => {
    render(<SkillList skills={mockSkills} />);
    expect(screen.getByText("スキル一覧")).toBeInTheDocument();
  });

  it("スキル登録ボタンを表示する", () => {
    render(<SkillList skills={mockSkills} />);
    expect(screen.getByRole("link", { name: /スキル登録/i })).toBeInTheDocument();
  });

  it("スキルがない場合は空状態メッセージを表示する", () => {
    render(<SkillList skills={[]} />);
    expect(screen.getByText("登録されているスキルがありません")).toBeInTheDocument();
  });

  it("スキルのリストを表示する", () => {
    render(<SkillList skills={mockSkills} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Figma")).toBeInTheDocument();
  });

  it("カテゴリバッジを表示する", () => {
    render(<SkillList skills={mockSkills} />);
    expect(screen.getByText("プログラミング")).toBeInTheDocument();
    expect(screen.getByText("デザイン")).toBeInTheDocument();
  });

  it("保有ユーザー数を表示する", () => {
    render(<SkillList skills={mockSkills} />);
    expect(screen.getByText("150人が保有")).toBeInTheDocument();
    expect(screen.getByText("80人が保有")).toBeInTheDocument();
  });
});

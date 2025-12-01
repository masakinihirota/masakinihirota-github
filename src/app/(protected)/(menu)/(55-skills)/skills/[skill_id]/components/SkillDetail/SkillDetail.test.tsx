// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillDetail, SkillDetailData } from "./SkillDetail";

// Next.js Link をモック
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("SkillDetail", () => {
  const mockSkill: SkillDetailData = {
    id: "1",
    name: "TypeScript",
    category: "プログラミング",
    description: "型安全なJavaScriptのスーパーセット",
    officialUrl: "https://www.typescriptlang.org/",
    userCount: 156,
    users: [
      { id: "u1", name: "田中太郎", level: "上級" },
      { id: "u2", name: "佐藤花子", level: "中級" },
    ],
    relatedWorks: [
      { id: "w1", title: "Webアプリ開発", authorName: "田中太郎" },
    ],
    relatedSkills: [
      { id: "2", name: "JavaScript" },
      { id: "3", name: "React" },
    ],
  };

  it("スキル名を表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("カテゴリを表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("プログラミング")).toBeInTheDocument();
  });

  it("保有ユーザー数を表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("156人が保有")).toBeInTheDocument();
  });

  it("概要を表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("型安全なJavaScriptのスーパーセット")).toBeInTheDocument();
  });

  it("公式サイトリンクを表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("公式サイト")).toBeInTheDocument();
  });

  it("保有ユーザーを表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("田中太郎")).toBeInTheDocument();
    expect(screen.getByText("佐藤花子")).toBeInTheDocument();
  });

  it("関連作品を表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("Webアプリ開発")).toBeInTheDocument();
  });

  it("関連スキルを表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    expect(screen.getByText("JavaScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
  });

  it("習得ボタンを表示する（未習得時）", () => {
    render(<SkillDetail skill={mockSkill} isAcquired={false} />);
    expect(screen.getByRole("button", { name: /習得する/i })).toBeInTheDocument();
  });

  it("習得済みバッジを表示する（習得済み時）", () => {
    render(<SkillDetail skill={mockSkill} isAcquired={true} />);
    expect(screen.getByText("習得済み")).toBeInTheDocument();
  });

  it("編集リンクを表示する", () => {
    render(<SkillDetail skill={mockSkill} />);
    const editLink = screen.getByRole("link", { name: /編集/i });
    expect(editLink).toHaveAttribute("href", "/skills/1/edit");
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SkillEditForm, EditableSkill } from "./SkillEditForm";

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

describe("SkillEditForm", () => {
  const mockSkill: EditableSkill = {
    id: "1",
    name: "TypeScript",
    category: "プログラミング",
    description: "型安全なJavaScript",
    officialUrl: "https://www.typescriptlang.org/",
  };

  it("スキル編集フォームのタイトルを表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    expect(screen.getByText("スキル編集")).toBeInTheDocument();
  });

  it("既存のスキル名を表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
  });

  it("既存の説明を表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    expect(screen.getByDisplayValue("型安全なJavaScript")).toBeInTheDocument();
  });

  it("既存の公式サイトURLを表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    expect(screen.getByDisplayValue("https://www.typescriptlang.org/")).toBeInTheDocument();
  });

  it("保存ボタンを表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    expect(screen.getByRole("button", { name: "保存" })).toBeInTheDocument();
  });

  it("キャンセルリンクを表示する", () => {
    render(<SkillEditForm skill={mockSkill} />);
    const cancelLink = screen.getByRole("link", { name: "キャンセル" });
    expect(cancelLink).toHaveAttribute("href", "/skills/1");
  });
});

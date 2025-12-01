/**
 * WorkEditForm コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkEditForm } from "./WorkEditForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockWork = {
  id: "1",
  title: "鬼滅の刃",
  author: "吾峠呼世晴",
  category: "manga",
  year: "2016",
  description: "人と鬼の戦い",
};

describe("WorkEditForm", () => {
  it("編集フォームのタイトルを表示する", () => {
    render(<WorkEditForm work={mockWork} />);

    expect(screen.getByRole("heading", { name: "作品を編集" })).toBeInTheDocument();
  });

  it("既存の値を表示する", () => {
    render(<WorkEditForm work={mockWork} />);

    expect(screen.getByDisplayValue("鬼滅の刃")).toBeInTheDocument();
    expect(screen.getByDisplayValue("吾峠呼世晴")).toBeInTheDocument();
  });

  it("保存ボタンを表示する", () => {
    render(<WorkEditForm work={mockWork} />);

    expect(screen.getByRole("button", { name: "保存する" })).toBeInTheDocument();
  });
});

/**
 * WorkDetail コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkDetail, WorkDetailData } from "./WorkDetail";

const mockWork: WorkDetailData = {
  id: "1",
  title: "鬼滅の刃",
  author: "吾峠呼世晴",
  category: "漫画",
  year: "2016",
  description: "人と鬼の戦いを描いた作品",
  myRating: undefined,
  comments: [
    {
      id: "c1",
      userId: "u1",
      userName: "山田太郎",
      content: "とても面白かったです！",
      createdAt: "2025-01-02",
    },
  ],
};

describe("WorkDetail", () => {
  it("作品のタイトルを表示する", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByRole("heading", { name: "鬼滅の刃" })).toBeInTheDocument();
  });

  it("カテゴリを表示する", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByText("漫画")).toBeInTheDocument();
  });

  it("作者を表示する", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByText("作者: 吾峠呼世晴")).toBeInTheDocument();
  });

  it("未評価の場合は評価ボタンを表示する", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByText("まだ評価していません")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "評価する" })).toBeInTheDocument();
  });

  it("コメントを表示する", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText("とても面白かったです！")).toBeInTheDocument();
  });
});

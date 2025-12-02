/**
 * 作品詳細ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkDetail } from "./components/WorkDetail";

const mockWork = {
  id: "1",
  title: "鬼滅の刃",
  author: "吾峠呼世晴",
  category: "漫画",
  year: "2016",
  myRating: undefined,
  comments: [],
};

describe("WorkDetailPage", () => {
  it("作品詳細をレンダリングする", () => {
    render(<WorkDetail work={mockWork} />);

    expect(screen.getByRole("heading", { name: "鬼滅の刃" })).toBeInTheDocument();
  });

  it("一覧に戻るリンクを表示する", () => {
    render(<WorkDetail work={mockWork} />);

    const backLink = screen.getByRole("link", { name: "一覧に戻る" });
    expect(backLink).toHaveAttribute("href", "/works");
  });
});

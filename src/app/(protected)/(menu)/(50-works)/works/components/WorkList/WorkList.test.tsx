/**
 * WorkList コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkList } from "./WorkList";

describe("WorkList", () => {
  it("作品一覧のタイトルを表示する", () => {
    render(<WorkList works={[]} />);

    expect(screen.getByRole("heading", { name: "作品一覧" })).toBeInTheDocument();
  });

  it("作品登録ボタンを表示する", () => {
    render(<WorkList works={[]} />);

    expect(screen.getByRole("link", { name: "作品を登録" })).toBeInTheDocument();
  });

  it("作品がない場合は空状態メッセージを表示する", () => {
    render(<WorkList works={[]} />);

    expect(screen.getByText("作品が見つかりません")).toBeInTheDocument();
  });

  it("作品のリストを表示する", () => {
    const mockWorks = [
      {
        id: "1",
        title: "鬼滅の刃",
        author: "吾峠呼世晴",
        category: "漫画",
        year: "2016",
      },
      {
        id: "2",
        title: "進撃の巨人",
        author: "諫山創",
        category: "漫画",
        year: "2009",
      },
    ];

    render(<WorkList works={mockWorks} />);

    expect(screen.getByText("鬼滅の刃")).toBeInTheDocument();
    expect(screen.getByText("進撃の巨人")).toBeInTheDocument();
    expect(screen.getByText("吾峠呼世晴")).toBeInTheDocument();
  });
});

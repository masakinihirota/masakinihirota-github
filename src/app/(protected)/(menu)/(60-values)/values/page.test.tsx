/**
 * 価値観一覧ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ValuesPage from "./page";

describe("ValuesPage", () => {
  it("価値観一覧ページをレンダリングする", () => {
    render(<ValuesPage />);

    expect(screen.getByRole("heading", { name: "価値観一覧" })).toBeInTheDocument();
  });

  it("価値観のリストを表示する", () => {
    render(<ValuesPage />);

    expect(screen.getByText("あなたにとって幸せとは？")).toBeInTheDocument();
    expect(screen.getByText("理想の働き方とは？")).toBeInTheDocument();
  });

  it("新規作成リンクを表示する", () => {
    render(<ValuesPage />);

    const newLink = screen.getByRole("link", { name: "新規作成" });
    expect(newLink).toBeInTheDocument();
    expect(newLink).toHaveAttribute("href", "/values/new");
  });
});

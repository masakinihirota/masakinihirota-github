/**
 * 作品一覧ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import WorksPage from "./page";

describe("WorksPage", () => {
  it("作品一覧ページをレンダリングする", () => {
    render(<WorksPage />);

    expect(screen.getByRole("heading", { name: "作品一覧" })).toBeInTheDocument();
  });

  it("作品のリストを表示する", () => {
    render(<WorksPage />);

    expect(screen.getByText("鬼滅の刃")).toBeInTheDocument();
    expect(screen.getByText("進撃の巨人")).toBeInTheDocument();
  });

  it("作品登録リンクを表示する", () => {
    render(<WorksPage />);

    const newLink = screen.getByRole("link", { name: "作品を登録" });
    expect(newLink).toBeInTheDocument();
    expect(newLink).toHaveAttribute("href", "/works/new");
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminContentPage } from "./AdminContentPage";

describe("AdminContentPage", () => {
  it("コンテンツ管理のタイトルを表示する", () => {
    render(<AdminContentPage />);
    expect(screen.getByRole("heading", { name: "コンテンツ管理" })).toBeInTheDocument();
  });

  it("統計情報を表示する", () => {
    render(<AdminContentPage />);
    expect(screen.getAllByText("未処理").length).toBeGreaterThan(0);
    expect(screen.getAllByText("解決済み").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/無視/).length).toBeGreaterThan(0);
  });

  it("通報キューを表示する", () => {
    render(<AdminContentPage />);
    expect(screen.getByRole("heading", { name: /通報キュー/i })).toBeInTheDocument();
  });

  it("通報の種類バッジを表示する", () => {
    render(<AdminContentPage />);
    expect(screen.getByText("スパム")).toBeInTheDocument();
    expect(screen.getByText("誹謗中傷")).toBeInTheDocument();
    expect(screen.getByText("不適切")).toBeInTheDocument();
  });

  it("アクションボタンを表示する", () => {
    render(<AdminContentPage />);
    expect(screen.getAllByRole("button", { name: /問題なし/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /警告送信/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /削除/i }).length).toBeGreaterThan(0);
  });
});

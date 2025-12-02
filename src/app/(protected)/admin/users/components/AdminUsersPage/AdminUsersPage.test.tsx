// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminUsersPage } from "./AdminUsersPage";

describe("AdminUsersPage", () => {
  it("ユーザー管理のタイトルを表示する", () => {
    render(<AdminUsersPage />);
    expect(screen.getByRole("heading", { name: "ユーザー管理" })).toBeInTheDocument();
  });

  it("検索フィールドを表示する", () => {
    render(<AdminUsersPage />);
    expect(screen.getByPlaceholderText("検索...")).toBeInTheDocument();
  });

  it("ユーザー一覧を表示する", () => {
    render(<AdminUsersPage />);
    expect(screen.getByRole("heading", { name: /ユーザー一覧/i })).toBeInTheDocument();
    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText("鈴木花子")).toBeInTheDocument();
  });

  it("ユーザーのステータスバッジを表示する", () => {
    render(<AdminUsersPage />);
    expect(screen.getAllByText("正常").length).toBeGreaterThan(0);
    expect(screen.getAllByText("凍結").length).toBeGreaterThan(0);
    expect(screen.getAllByText("BAN").length).toBeGreaterThan(0);
  });

  it("アクションボタンを表示する", () => {
    render(<AdminUsersPage />);
    const detailButtons = screen.getAllByRole("button", { name: /詳細/i });
    expect(detailButtons.length).toBeGreaterThan(0);
  });
});

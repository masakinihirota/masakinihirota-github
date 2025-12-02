// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminPenaltiesPage } from "./AdminPenaltiesPage";

describe("AdminPenaltiesPage", () => {
  it("ペナルティ管理のタイトルを表示する", () => {
    render(<AdminPenaltiesPage />);
    expect(screen.getByRole("heading", { name: "ペナルティ管理" })).toBeInTheDocument();
  });

  it("ペナルティ履歴セクションを表示する", () => {
    render(<AdminPenaltiesPage />);
    expect(screen.getByRole("heading", { name: /ペナルティ履歴/i })).toBeInTheDocument();
  });

  it("ペナルティの種類バッジを表示する", () => {
    render(<AdminPenaltiesPage />);
    expect(screen.getByText("永久BAN")).toBeInTheDocument();
    expect(screen.getByText("一時停止")).toBeInTheDocument();
    expect(screen.getByText("警告")).toBeInTheDocument();
  });

  it("自動ルール設定セクションを表示する", () => {
    render(<AdminPenaltiesPage />);
    expect(screen.getByRole("heading", { name: /自動ルール設定/i })).toBeInTheDocument();
  });

  it("NGワード設定セクションを表示する", () => {
    render(<AdminPenaltiesPage />);
    expect(screen.getByRole("heading", { name: /NGワード設定/i })).toBeInTheDocument();
  });

  it("解除ボタンを表示する", () => {
    render(<AdminPenaltiesPage />);
    const undoButtons = screen.getAllByRole("button", { name: /解除/i });
    expect(undoButtons.length).toBeGreaterThan(0);
  });
});

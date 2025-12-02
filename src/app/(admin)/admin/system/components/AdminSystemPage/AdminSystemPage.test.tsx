// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminSystemPage } from "./AdminSystemPage";

describe("AdminSystemPage", () => {
  it("システム管理のタイトルを表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByRole("heading", { name: "システム管理" })).toBeInTheDocument();
  });

  it("システムログセクションを表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByRole("heading", { name: /システムログ/i })).toBeInTheDocument();
  });

  it("ログフィルターボタンを表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByRole("button", { name: "すべて" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Info" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Warning" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Error" })).toBeInTheDocument();
  });

  it("ジョブ管理セクションを表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByRole("heading", { name: /ジョブ管理/i })).toBeInTheDocument();
  });

  it("ジョブ一覧を表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByText("日次バックアップ")).toBeInTheDocument();
    expect(screen.getByText("メール送信キュー処理")).toBeInTheDocument();
    expect(screen.getByText("統計データ集計")).toBeInTheDocument();
  });

  it("キャッシュクリアボタンを表示する", () => {
    render(<AdminSystemPage />);
    expect(screen.getByRole("button", { name: /キャッシュクリア/i })).toBeInTheDocument();
  });
});

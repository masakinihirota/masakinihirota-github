// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminHomePage } from "./AdminHomePage";

describe("AdminHomePage", () => {
  it("管理者ダッシュボードのタイトルを表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByRole("heading", { name: "管理者ダッシュボード" })).toBeInTheDocument();
  });

  it("システムステータスを表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByText(/システム正常/i)).toBeInTheDocument();
  });

  it("KPIパネルを表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByText("総ユーザー数")).toBeInTheDocument();
    expect(screen.getByText("DAU (日次アクティブ)")).toBeInTheDocument();
    expect(screen.getByText("投稿数")).toBeInTheDocument();
    expect(screen.getByText("国数")).toBeInTheDocument();
  });

  it("アラート一覧を表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByRole("heading", { name: /アラート/i })).toBeInTheDocument();
    expect(screen.getByText(/サーバーエラー/i)).toBeInTheDocument();
  });

  it("最近のアクティビティを表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByRole("heading", { name: /最近のアクティビティ/i })).toBeInTheDocument();
    expect(screen.getByText(/ユーザーをBANしました/i)).toBeInTheDocument();
  });

  it("管理メニューへのリンクを表示する", () => {
    render(<AdminHomePage />);
    expect(screen.getByRole("button", { name: /ユーザー管理/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /コンテンツ管理/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /システム管理/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ペナルティ管理/i })).toBeInTheDocument();
  });
});

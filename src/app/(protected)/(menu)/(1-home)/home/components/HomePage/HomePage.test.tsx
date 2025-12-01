// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("ウェルカムメッセージを表示する", () => {
    render(<HomePage />);
    expect(screen.getByText(/ようこそ/)).toBeInTheDocument();
  });

  it("クイックアクションセクションを表示する", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: "クイックアクション" })).toBeInTheDocument();
  });

  it("クイックアクションボタンを表示する", () => {
    render(<HomePage />);
    expect(screen.getByRole("button", { name: /マッチング開始/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /作品登録/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /プロフィール作成/i })).toBeInTheDocument();
  });

  it("最近の活動セクションを表示する", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /最近の活動/i })).toBeInTheDocument();
  });

  it("おすすめセクションを表示する", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { name: /おすすめのユーザー/i })).toBeInTheDocument();
  });
});

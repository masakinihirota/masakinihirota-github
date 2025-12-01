// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactPage } from "./ContactPage";

describe("ContactPage", () => {
  it("ページタイトルを表示する", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { name: "お問い合わせ" })).toBeInTheDocument();
  });

  it("フォームフィールドを表示する", () => {
    render(<ContactPage />);
    expect(screen.getByLabelText(/お名前/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/件名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/本文/i)).toBeInTheDocument();
  });

  it("カテゴリ選択を表示する", () => {
    render(<ContactPage />);
    expect(screen.getByText("カテゴリ *")).toBeInTheDocument();
  });

  it("送信ボタンを表示する", () => {
    render(<ContactPage />);
    expect(screen.getByRole("button", { name: /送信する/i })).toBeInTheDocument();
  });

  it("キャンセルボタンを表示する", () => {
    render(<ContactPage />);
    expect(screen.getByRole("button", { name: "キャンセル" })).toBeInTheDocument();
  });
});

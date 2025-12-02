// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQPage } from "./FAQPage";

describe("FAQPage", () => {
  it("ページタイトルを表示する", () => {
    render(<FAQPage />);
    expect(screen.getByRole("heading", { name: /よくある質問/i })).toBeInTheDocument();
  });

  it("検索入力欄を表示する", () => {
    render(<FAQPage />);
    expect(screen.getByPlaceholderText("キーワードで検索...")).toBeInTheDocument();
  });

  it("人気の質問セクションを表示する", () => {
    render(<FAQPage />);
    expect(screen.getByRole("heading", { name: "人気の質問" })).toBeInTheDocument();
  });

  it("カテゴリボタンを表示する", () => {
    render(<FAQPage />);
    expect(screen.getByRole("button", { name: "すべて" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "アカウント・ログイン" })).toBeInTheDocument();
  });

  it("質問をクリックすると回答が表示される", async () => {
    const user = userEvent.setup();
    render(<FAQPage />);

    // 複数の同じ質問が表示される（人気の質問とカテゴリ一覧）ため、最初のものを取得
    const questionButtons = screen.getAllByRole("button", { name: /パスワードを忘れてしまいました/i });
    await user.click(questionButtons[0]);

    // クリック後、両方のセクションで回答が開かれる可能性があるため getAllByText を使用
    const answers = screen.getAllByText(/パスワードをリセットできます/i);
    expect(answers.length).toBeGreaterThan(0);
  });
});

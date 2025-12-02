// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HelpPage } from "./HelpPage";

describe("HelpPage", () => {
  it("ページタイトルを表示する", () => {
    render(<HelpPage />);
    expect(screen.getByRole("heading", { name: "ヘルプセンター" })).toBeInTheDocument();
  });

  it("検索入力欄を表示する", () => {
    render(<HelpPage />);
    expect(screen.getByPlaceholderText("キーワードを入力して検索...")).toBeInTheDocument();
  });

  it("よくある質問セクションを表示する", () => {
    render(<HelpPage />);
    expect(screen.getByRole("heading", { name: /よくある質問/i })).toBeInTheDocument();
  });

  it("カテゴリ一覧を表示する", () => {
    render(<HelpPage />);
    expect(screen.getByRole("heading", { name: "カテゴリから探す" })).toBeInTheDocument();
    expect(screen.getByText("アカウント・ログイン")).toBeInTheDocument();
    expect(screen.getByText("作品登録・編集")).toBeInTheDocument();
  });

  it("お問い合わせボタンを表示する", () => {
    render(<HelpPage />);
    expect(screen.getByRole("button", { name: "お問い合わせフォーム" })).toBeInTheDocument();
  });
});

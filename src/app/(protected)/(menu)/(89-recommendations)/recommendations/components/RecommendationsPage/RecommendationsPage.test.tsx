// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RecommendationsPage } from "./RecommendationsPage";

describe("RecommendationsPage", () => {
  it("ページタイトルを表示する", () => {
    render(<RecommendationsPage />);
    expect(screen.getByRole("heading", { name: "あなたへのおすすめ" })).toBeInTheDocument();
  });

  it("更新ボタンを表示する", () => {
    render(<RecommendationsPage />);
    expect(screen.getByRole("button", { name: /更新する/i })).toBeInTheDocument();
  });

  it("おすすめユーザーセクションを表示する", () => {
    render(<RecommendationsPage />);
    expect(screen.getByRole("heading", { name: /おすすめのユーザー/i })).toBeInTheDocument();
  });

  it("特集セクションを表示する", () => {
    render(<RecommendationsPage />);
    expect(screen.getByRole("heading", { name: /SF好きのあなたへ/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /話題の組織/i })).toBeInTheDocument();
  });

  it("興味ありボタンを表示する", () => {
    render(<RecommendationsPage />);
    const interestButtons = screen.getAllByRole("button", { name: /興味あり/i });
    expect(interestButtons.length).toBeGreaterThan(0);
  });
});

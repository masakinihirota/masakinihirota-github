// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TermsOfServicePage } from "./TermsOfServicePage";

describe("TermsOfServicePage", () => {
  it("ページタイトルを表示する", () => {
    render(<TermsOfServicePage />);
    expect(screen.getByRole("heading", { name: "利用規約" })).toBeInTheDocument();
  });

  it("最終更新日を表示する", () => {
    render(<TermsOfServicePage />);
    expect(screen.getByText(/最終更新日/)).toBeInTheDocument();
  });

  it("目次を表示する", () => {
    render(<TermsOfServicePage />);
    expect(screen.getByRole("heading", { name: "目次" })).toBeInTheDocument();
  });

  it("印刷ボタンを表示する", () => {
    render(<TermsOfServicePage />);
    expect(screen.getByRole("button", { name: /印刷/i })).toBeInTheDocument();
  });

  it("規約条文を表示する", () => {
    render(<TermsOfServicePage />);
    expect(screen.getByRole("heading", { name: /はじめに/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /禁止事項/i })).toBeInTheDocument();
  });
});

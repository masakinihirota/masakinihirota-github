// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PrivacyPolicyPage } from "./PrivacyPolicyPage";

describe("PrivacyPolicyPage", () => {
  it("ページタイトルを表示する", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole("heading", { name: "プライバシーポリシー" })).toBeInTheDocument();
  });

  it("最終更新日を表示する", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByText(/最終更新日/)).toBeInTheDocument();
  });

  it("目次を表示する", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole("heading", { name: "目次" })).toBeInTheDocument();
  });

  it("ポリシー内容を表示する", () => {
    render(<PrivacyPolicyPage />);
    expect(screen.getByRole("heading", { name: /収集する情報/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ユーザーの権利/i })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SettingsPage } from "./SettingsPage";

describe("SettingsPage", () => {
  it("ページタイトルを表示する", () => {
    render(<SettingsPage />);
    expect(screen.getByRole("heading", { name: "設定" })).toBeInTheDocument();
  });

  it("タブを表示する", () => {
    render(<SettingsPage />);
    expect(screen.getByRole("tab", { name: /アカウント/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /プライバシー/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /セキュリティ/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /連携/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /支払い/i })).toBeInTheDocument();
  });

  it("アカウント設定を表示する", () => {
    render(<SettingsPage />);
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByLabelText("表示名")).toBeInTheDocument();
    expect(screen.getByText("言語")).toBeInTheDocument();
  });

  it("保存ボタンを表示する", () => {
    render(<SettingsPage />);
    expect(screen.getAllByRole("button", { name: "保存する" }).length).toBeGreaterThan(0);
  });
});

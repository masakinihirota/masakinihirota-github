/**
 * RootAccountSettings コンポーネントのテスト
 * @vitest-environment jsdom
 *
 * 要件:
 * - アカウントセキュリティ設定の表示
 * - リスタート機能へのアクセス
 * - アカウント削除機能へのアクセス
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RootAccountSettings } from "./RootAccountSettings";

// Mock the next/link
vi.mock("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const mockRootAccount = {
  id: "root-123",
  displayName: "山田太郎",
  email: "yamada@example.com",
  lastRestartAt: "2025-01-01T00:00:00Z",
};

describe("RootAccountSettings", () => {
  it("設定画面のタイトルを表示する", () => {
    render(<RootAccountSettings rootAccount={mockRootAccount} />);

    expect(screen.getByText(/ルートアカウント設定/)).toBeInTheDocument();
  });

  it("アカウントセキュリティセクションを表示する", () => {
    render(<RootAccountSettings rootAccount={mockRootAccount} />);

    expect(screen.getByText(/アカウントセキュリティ/)).toBeInTheDocument();
    expect(screen.getByText(/認証プロバイダ/i)).toBeInTheDocument();
  });

  it("リスタート機能セクションを表示する", () => {
    render(<RootAccountSettings rootAccount={mockRootAccount} />);

    expect(
      screen.getByText("🔄 リスタート（強くてニューゲーム）")
    ).toBeInTheDocument();
    expect(screen.getByText(/強くてニューゲーム/)).toBeInTheDocument();
  });

  it("危険なエリアセクションを表示する", () => {
    render(<RootAccountSettings rootAccount={mockRootAccount} />);

    expect(screen.getByText(/危険なエリア/)).toBeInTheDocument();
    expect(screen.getByText(/アカウント削除/)).toBeInTheDocument();
  });
});

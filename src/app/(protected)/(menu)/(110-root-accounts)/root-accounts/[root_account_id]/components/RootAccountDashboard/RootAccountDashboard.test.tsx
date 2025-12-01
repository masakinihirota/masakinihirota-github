/**
 * RootAccountDashboard コンポーネントのテスト
 * @vitest-environment jsdom
 *
 * 要件:
 * - ルートアカウントの基本情報表示
 * - ポイント残高の表示
 * - プロフィール一覧の表示
 * - アチーブメント一覧の表示
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RootAccountDashboard } from "./RootAccountDashboard";

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
  location: "東京都",
  language: "日本語",
  generation: "1990年代",
  points: 1500,
};

const mockProfiles = [
  {
    id: "profile-1",
    name: "ビジネスプロフィール",
    purpose: "仕事",
    avatarUrl: "/avatar1.png",
  },
  {
    id: "profile-2",
    name: "趣味プロフィール",
    purpose: "遊び",
    avatarUrl: "/avatar2.png",
  },
];

const mockAchievements = [
  { id: "ach-1", name: "初陣", description: "初組織作成", unlocked: true },
  { id: "ach-2", name: "人気者", description: "メンバー10人達成", unlocked: true },
  {
    id: "ach-3",
    name: "大国建設者",
    description: "国を建国する",
    unlocked: false,
  },
];

describe("RootAccountDashboard", () => {
  it("ルートアカウントの基本情報を表示する", () => {
    render(
      <RootAccountDashboard
        rootAccount={mockRootAccount}
        profiles={mockProfiles}
        achievements={mockAchievements}
      />
    );

    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText(/東京都/)).toBeInTheDocument();
    expect(screen.getByText(/日本語/)).toBeInTheDocument();
    expect(screen.getByText(/1990年代/)).toBeInTheDocument();
  });

  it("ポイント残高を表示する", () => {
    render(
      <RootAccountDashboard
        rootAccount={mockRootAccount}
        profiles={mockProfiles}
        achievements={mockAchievements}
      />
    );

    expect(screen.getByText(/1,500/)).toBeInTheDocument();
    expect(screen.getByText(/pt/i)).toBeInTheDocument();
  });

  it("プロフィール一覧を表示する", () => {
    render(
      <RootAccountDashboard
        rootAccount={mockRootAccount}
        profiles={mockProfiles}
        achievements={mockAchievements}
      />
    );

    expect(screen.getByText("ビジネスプロフィール")).toBeInTheDocument();
    expect(screen.getByText("趣味プロフィール")).toBeInTheDocument();
    expect(screen.getByText(/仕事/)).toBeInTheDocument();
    expect(screen.getByText(/遊び/)).toBeInTheDocument();
  });

  it("アチーブメント一覧を表示する", () => {
    render(
      <RootAccountDashboard
        rootAccount={mockRootAccount}
        profiles={mockProfiles}
        achievements={mockAchievements}
      />
    );

    expect(screen.getByText("初陣")).toBeInTheDocument();
    expect(screen.getByText("人気者")).toBeInTheDocument();
    // 未取得のアチーブメントは🔒で表示
    expect(screen.getByText(/大国建設者/)).toBeInTheDocument();
  });
});

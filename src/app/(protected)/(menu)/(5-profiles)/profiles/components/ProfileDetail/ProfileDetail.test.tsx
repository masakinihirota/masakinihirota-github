/**
 * ProfileDetail コンポーネント テスト
 *
 * TDD RED Phase: 最初の失敗テストを 1 つだけ追加
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - プロフィール情報（名前、Bio、目的、役割、種類）を表示する
 * - 登録作品セクションを表示する
 * - 価値観セクションを表示する
 * - スキルセクションを表示する
 * - 所属組織セクションを表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileDetail } from "./ProfileDetail";

const mockProfile = {
  id: "1",
  displayName: "田中太郎",
  avatarUrl: "/avatars/tanaka.jpg",
  bio: "クリエイティブなデザイナーです。価値観を大切にしています。",
  purpose: "仕事",
  role: "リーダー",
  type: "本人（匿名）",
  isOwner: true,
};

describe("ProfileDetail", () => {
  it("プロフィール名を表示する", () => {
    render(<ProfileDetail profile={mockProfile} />);

    expect(screen.getByRole("heading", { name: "田中太郎" })).toBeInTheDocument();
  });

  it("プロフィール情報（Bio、目的、役割、種類）を表示する", () => {
    render(<ProfileDetail profile={mockProfile} />);

    expect(screen.getByText("クリエイティブなデザイナーです。価値観を大切にしています。")).toBeInTheDocument();
    expect(screen.getByText("目的: 仕事")).toBeInTheDocument();
    expect(screen.getByText("役割: リーダー")).toBeInTheDocument();
    expect(screen.getByText("種類: 本人（匿名）")).toBeInTheDocument();
  });

  it("自分のプロフィールの場合は編集ボタンを表示する", () => {
    render(<ProfileDetail profile={mockProfile} />);

    expect(screen.getByRole("link", { name: "編集" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "フォロー" })).not.toBeInTheDocument();
  });

  it("他人のプロフィールの場合はフォローボタンを表示する", () => {
    const otherProfile = { ...mockProfile, isOwner: false };
    render(<ProfileDetail profile={otherProfile} />);

    expect(screen.getByRole("button", { name: "フォロー" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "編集" })).not.toBeInTheDocument();
  });
});

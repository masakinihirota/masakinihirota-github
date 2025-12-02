/**
 * ProfileEditForm コンポーネント テスト
 *
 * TDD RED Phase: プロフィール編集フォームのテスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - 現在の情報がプリセットされたフォームを表示する
 * - 基本情報編集フィールドを表示する
 * - 属性編集フィールドを表示する
 * - 保存ボタンとキャンセルボタンを表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileEditForm } from "./ProfileEditForm";

const mockProfile = {
  id: "profile-1",
  displayName: "山田太郎",
  username: "yamada_taro",
  bio: "テストユーザーの自己紹介です",
  role: "leader",
  purpose: "work",
  type: "self",
};

describe("ProfileEditForm", () => {
  it("編集フォームのタイトルを表示する", () => {
    render(<ProfileEditForm profile={mockProfile} />);

    expect(screen.getByRole("heading", { name: /プロフィール編集/i })).toBeInTheDocument();
  });

  it("現在の情報がプリセットされた基本情報フィールドを表示する", () => {
    render(<ProfileEditForm profile={mockProfile} />);

    expect(screen.getByDisplayValue("山田太郎")).toBeInTheDocument();
    expect(screen.getByDisplayValue("yamada_taro")).toBeInTheDocument();
    expect(screen.getByDisplayValue("テストユーザーの自己紹介です")).toBeInTheDocument();
  });

  it("属性設定セクションを表示する", () => {
    render(<ProfileEditForm profile={mockProfile} />);

    expect(screen.getByRole("heading", { name: /属性設定/i })).toBeInTheDocument();
  });

  it("保存ボタンとキャンセルボタンを表示する", () => {
    render(<ProfileEditForm profile={mockProfile} />);

    expect(screen.getByRole("button", { name: /保存/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /キャンセル/i })).toBeInTheDocument();
  });
});

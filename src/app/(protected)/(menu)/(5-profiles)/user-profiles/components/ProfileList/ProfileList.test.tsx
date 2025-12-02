/**
 * ProfileList コンポーネント テスト
 *
 * TDD RED Phase: 最初の失敗テストを 1 つだけ追加
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - プロフィール一覧を表示する
 * - アバター、表示名、肩書き、所属を表示する
 * - フォロー/詳細アクションを提供する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileList } from "./ProfileList";

describe("ProfileList", () => {
  it("プロフィール一覧のタイトルを表示する", () => {
    render(<ProfileList profiles={[]} />);

    expect(screen.getByRole("heading", { name: "プロフィール一覧" })).toBeInTheDocument();
  });

  it("プロフィールがない場合は空状態メッセージを表示する", () => {
    render(<ProfileList profiles={[]} />);

    expect(screen.getByText("ユーザーが見つかりません")).toBeInTheDocument();
    expect(screen.getByText("検索条件を変更してください")).toBeInTheDocument();
  });

  it("プロフィールのリストを表示する", () => {
    const mockProfiles = [
      {
        id: "1",
        displayName: "田中太郎",
        role: "Designer",
        affiliation: "クリエイティブ組織A",
        matchScore: 95,
      },
      {
        id: "2",
        displayName: "佐藤花子",
        role: "Engineer",
        affiliation: "テック国B",
      },
    ];

    render(<ProfileList profiles={mockProfiles} />);

    // 表示名の確認
    expect(screen.getByText("田中太郎")).toBeInTheDocument();
    expect(screen.getByText("佐藤花子")).toBeInTheDocument();

    // ロールの確認
    expect(screen.getByText("Designer")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();

    // 所属の確認
    expect(screen.getByText("クリエイティブ組織A")).toBeInTheDocument();
    expect(screen.getByText("テック国B")).toBeInTheDocument();

    // マッチングスコアの確認（存在する場合のみ）
    expect(screen.getByText("95% Match")).toBeInTheDocument();

    // アクションボタンの確認
    expect(screen.getAllByRole("link", { name: "詳細" })).toHaveLength(2);
    expect(screen.getAllByRole("button", { name: "フォロー" })).toHaveLength(2);
  });
});

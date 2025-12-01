/**
 * ValueList コンポーネント テスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - 価値観一覧を表示する
 * - タイトル、カテゴリ、作成者、統計情報を表示する
 * - 詳細・回答アクションを提供する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueList } from "./ValueList";

describe("ValueList", () => {
  it("価値観一覧のタイトルを表示する", () => {
    render(<ValueList values={[]} />);

    expect(screen.getByRole("heading", { name: "価値観一覧" })).toBeInTheDocument();
  });

  it("新規作成ボタンを表示する", () => {
    render(<ValueList values={[]} />);

    expect(screen.getByRole("link", { name: "新規作成" })).toBeInTheDocument();
  });

  it("価値観がない場合は空状態メッセージを表示する", () => {
    render(<ValueList values={[]} />);

    expect(screen.getByText("価値観が見つかりません")).toBeInTheDocument();
    expect(screen.getByText("新しい価値観を作成してください")).toBeInTheDocument();
  });

  it("価値観のリストを表示する", () => {
    const mockValues = [
      {
        id: "1",
        title: "あなたにとって幸せとは？",
        category: "人生",
        description: "幸福の定義について考えましょう",
        creator: "田中太郎",
        answerCount: 42,
      },
      {
        id: "2",
        title: "理想の働き方とは？",
        category: "仕事",
        answerCount: 28,
      },
    ];

    render(<ValueList values={mockValues} />);

    // タイトルの確認
    expect(screen.getByText("あなたにとって幸せとは？")).toBeInTheDocument();
    expect(screen.getByText("理想の働き方とは？")).toBeInTheDocument();

    // カテゴリの確認
    expect(screen.getByText("人生")).toBeInTheDocument();
    expect(screen.getByText("仕事")).toBeInTheDocument();

    // 作成者の確認
    expect(screen.getByText("作成者: 田中太郎")).toBeInTheDocument();

    // 回答数の確認
    expect(screen.getByText("42件の回答")).toBeInTheDocument();
    expect(screen.getByText("28件の回答")).toBeInTheDocument();
  });
});

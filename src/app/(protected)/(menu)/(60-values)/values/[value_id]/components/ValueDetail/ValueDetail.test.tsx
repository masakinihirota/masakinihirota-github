/**
 * ValueDetail コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValueDetail, ValueDetailData } from "./ValueDetail";

const mockValue: ValueDetailData = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "人生",
  description: "幸福の定義について考えましょう",
  creator: "田中太郎",
  createdAt: "2025-01-01",
  answerCount: 42,
  myAnswer: undefined,
  answers: [
    {
      id: "a1",
      userId: "u1",
      userName: "佐藤花子",
      content: "家族と過ごす時間が幸せです",
      createdAt: "2025-01-02",
      likes: 5,
    },
  ],
};

describe("ValueDetail", () => {
  it("価値観のタイトルを表示する", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByRole("heading", { name: "あなたにとって幸せとは？" })).toBeInTheDocument();
  });

  it("カテゴリを表示する", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByText("人生")).toBeInTheDocument();
  });

  it("作成者を表示する", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByText("作成者: 田中太郎")).toBeInTheDocument();
  });

  it("未回答の場合は回答ボタンを表示する", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByText("まだ回答していません")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "回答する" })).toBeInTheDocument();
  });

  it("みんなの回答を表示する", () => {
    render(<ValueDetail value={mockValue} />);

    expect(screen.getByText("佐藤花子")).toBeInTheDocument();
    expect(screen.getByText("家族と過ごす時間が幸せです")).toBeInTheDocument();
  });

  it("回答済みの場合は自分の回答を表示する", () => {
    const valueWithMyAnswer = {
      ...mockValue,
      myAnswer: "健康で笑顔でいられることです",
    };

    render(<ValueDetail value={valueWithMyAnswer} />);

    expect(screen.getByText("健康で笑顔でいられることです")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "回答を編集" })).toBeInTheDocument();
  });
});

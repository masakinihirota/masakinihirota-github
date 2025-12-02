/**
 * ProfileCreateForm コンポーネント テスト
 *
 * TDD RED Phase: プロフィール新規作成フォームのテスト
 *
 * @vitest-environment jsdom
 *
 * @description
 * UI設計書に基づく受け入れ基準:
 * - 基本情報入力フォームを表示する（表示名、ID、自己紹介）
 * - 属性設定を表示する（役割、目的、種類）
 * - 作成ボタンとキャンセルボタンを表示する
 * - バリデーションエラーを表示する
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProfileCreateForm } from "./ProfileCreateForm";

describe("ProfileCreateForm", () => {
  it("フォームのタイトルを表示する", () => {
    render(<ProfileCreateForm />);

    expect(screen.getByRole("heading", { name: /プロフィール作成/i })).toBeInTheDocument();
  });

  it("基本情報入力フィールドを表示する", () => {
    render(<ProfileCreateForm />);

    expect(screen.getByLabelText(/表示名/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ユーザーID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/自己紹介/i)).toBeInTheDocument();
  });

  it("属性設定フィールドを表示する", () => {
    render(<ProfileCreateForm />);

    expect(screen.getByRole("heading", { name: /属性設定/i })).toBeInTheDocument();
    expect(screen.getByText("役割 *")).toBeInTheDocument();
    expect(screen.getByText("目的 *")).toBeInTheDocument();
    expect(screen.getByText("種類 *")).toBeInTheDocument();
  });

  it("作成ボタンとキャンセルボタンを表示する", () => {
    render(<ProfileCreateForm />);

    expect(screen.getByRole("button", { name: /作成/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /キャンセル/i })).toBeInTheDocument();
  });
});

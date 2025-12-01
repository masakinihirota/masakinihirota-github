/**
 * OrganizationCreateForm コンポーネントのテスト
 * @vitest-environment jsdom
 *
 * 要件:
 * - 組織作成フォームのタイトル表示
 * - 基本情報入力フィールドの表示
 * - 組織種別選択の表示
 * - 作成・キャンセルボタンの表示
 */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OrganizationCreateForm } from "./OrganizationCreateForm";

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

describe("OrganizationCreateForm", () => {
  it("フォームのタイトルを表示する", () => {
    render(<OrganizationCreateForm />);

    expect(screen.getByText("🏢 組織を作成")).toBeInTheDocument();
  });

  it("基本情報入力フィールドを表示する", () => {
    render(<OrganizationCreateForm />);

    expect(screen.getByLabelText(/組織名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/組織ID/)).toBeInTheDocument();
  });

  it("組織種別選択を表示する", () => {
    render(<OrganizationCreateForm />);

    expect(screen.getByLabelText(/組織の種類/)).toBeInTheDocument();
    // 選択肢を確認
    expect(screen.getByText(/会社/)).toBeInTheDocument();
    expect(screen.getByText(/サークル/)).toBeInTheDocument();
  });

  it("作成ボタンとキャンセルボタンを表示する", () => {
    render(<OrganizationCreateForm />);

    expect(
      screen.getByRole("button", { name: /作成する/ })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /キャンセル/ })).toBeInTheDocument();
  });
});

/**
 * WorkCreateForm コンポーネント テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkCreateForm } from "./WorkCreateForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("WorkCreateForm", () => {
  it("作品登録フォームのタイトルを表示する", () => {
    render(<WorkCreateForm />);

    expect(screen.getByRole("heading", { name: "作品を登録" })).toBeInTheDocument();
  });

  it("タイトル入力フィールドを表示する", () => {
    render(<WorkCreateForm />);

    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
  });

  it("作者入力フィールドを表示する", () => {
    render(<WorkCreateForm />);

    expect(screen.getByLabelText(/作者/)).toBeInTheDocument();
  });

  it("登録ボタンを表示する", () => {
    render(<WorkCreateForm />);

    expect(screen.getByRole("button", { name: "登録する" })).toBeInTheDocument();
  });
});

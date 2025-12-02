// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NationCreateForm } from "./NationCreateForm";

describe("NationCreateForm", () => {
  it("フォームのタイトルを表示する", () => {
    render(<NationCreateForm />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("国を建国する");
  });

  it("基本情報入力フィールドを表示する", () => {
    render(<NationCreateForm />);
    expect(screen.getByLabelText(/国名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/国ID/)).toBeInTheDocument();
    expect(screen.getByLabelText(/国旗/)).toBeInTheDocument();
    expect(screen.getByLabelText(/テーマカラー/)).toBeInTheDocument();
  });

  it("憲法・理念入力フィールドを表示する", () => {
    render(<NationCreateForm />);
    expect(screen.getByLabelText(/憲法/)).toBeInTheDocument();
  });

  it("建国ボタンと必要ポイントを表示する", () => {
    render(<NationCreateForm />);
    expect(screen.getByRole("button", { name: /建国する/ })).toBeInTheDocument();
    expect(screen.getByText(/1,000pt/)).toBeInTheDocument();
  });
});

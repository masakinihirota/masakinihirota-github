// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OasisDeclarationPage } from "./OasisDeclarationPage";

describe("OasisDeclarationPage", () => {
  it("ページタイトルを表示する", () => {
    render(<OasisDeclarationPage />);
    expect(screen.getByRole("heading", { name: "オアシス宣言" })).toBeInTheDocument();
  });

  it("宣言文を表示する", () => {
    render(<OasisDeclarationPage />);
    expect(screen.getByText(/自分らしくいられる場所/)).toBeInTheDocument();
  });

  it("3つの約束を表示する", () => {
    render(<OasisDeclarationPage />);
    expect(screen.getByRole("heading", { name: /私たちの3つの約束/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "尊重" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "安全" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "成長" })).toBeInTheDocument();
  });

  it("参加ボタンを表示する", () => {
    render(<OasisDeclarationPage />);
    expect(screen.getByRole("button", { name: /同意して参加する/i })).toBeInTheDocument();
  });

  it("シェアボタンを表示する", () => {
    render(<OasisDeclarationPage />);
    expect(screen.getByRole("button", { name: /シェアする/i })).toBeInTheDocument();
  });
});

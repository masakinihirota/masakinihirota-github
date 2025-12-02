// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HumanDeclarationPage } from "./HumanDeclarationPage";

describe("HumanDeclarationPage", () => {
  it("ページタイトルを表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByRole("heading", { name: "人間宣言" })).toBeInTheDocument();
  });

  it("宣言文を表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByText(/人間の尊厳と創造性/)).toBeInTheDocument();
  });

  it("私たちの信念セクションを表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByRole("heading", { name: /私たちの信念/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "人間中心の設計" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AIとの共存" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "創造性の尊重" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "多様性の包摂" })).toBeInTheDocument();
  });

  it("権利と責任セクションを表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByRole("heading", { name: /私たちの権利と責任/i })).toBeInTheDocument();
    expect(screen.getByText("権利")).toBeInTheDocument();
    expect(screen.getByText("責任")).toBeInTheDocument();
  });

  it("参加ボタンを表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByRole("button", { name: /同意して参加する/i })).toBeInTheDocument();
  });

  it("シェアボタンを表示する", () => {
    render(<HumanDeclarationPage />);
    expect(screen.getByRole("button", { name: /シェアする/i })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Admin Page", () => {
  it("renders AdminHomePage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "管理者ダッシュボード" })).toBeInTheDocument();
  });

  it("renders system status", () => {
    render(<Page />);
    expect(screen.getByText(/システム正常/i)).toBeInTheDocument();
  });

  it("renders KPI panel", () => {
    render(<Page />);
    expect(screen.getByText("総ユーザー数")).toBeInTheDocument();
    expect(screen.getByText("DAU (日次アクティブ)")).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NationSettings } from "./NationSettings";

describe("NationSettings", () => {
  const mockNation = {
    id: "nation-123",
    name: "Neo Japan",
    taxRate: 10,
    immigrationPolicy: "approval",
  };

  it("設定画面のタイトルを表示する", () => {
    render(<NationSettings nation={mockNation} />);
    expect(screen.getByTestId("page-title")).toHaveTextContent("国設定");
  });

  it("制度設定セクションを表示する", () => {
    render(<NationSettings nation={mockNation} />);
    expect(screen.getByText("制度設定")).toBeInTheDocument();
    expect(screen.getByLabelText(/税率/)).toBeInTheDocument();
    expect(screen.getByLabelText(/移住制限/)).toBeInTheDocument();
  });

  it("危険な設定セクションを表示する", () => {
    render(<NationSettings nation={mockNation} />);
    expect(screen.getByText("危険な設定")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /国を滅亡/ })).toBeInTheDocument();
  });

  it("保存ボタンを表示する", () => {
    render(<NationSettings nation={mockNation} />);
    expect(screen.getByRole("button", { name: /設定を保存/ })).toBeInTheDocument();
  });
});

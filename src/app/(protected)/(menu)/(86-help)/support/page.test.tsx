// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Help Page", () => {
  it("renders HelpPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "ヘルプセンター" })).toBeInTheDocument();
  });

  it("displays search functionality", () => {
    render(<Page />);
    expect(screen.getByPlaceholderText("キーワードを入力して検索...")).toBeInTheDocument();
  });
});

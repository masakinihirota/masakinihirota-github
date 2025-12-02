// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("FAQ Page", () => {
  it("renders FAQPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: /よくある質問/i })).toBeInTheDocument();
  });

  it("displays category buttons", () => {
    render(<Page />);
    expect(screen.getByRole("button", { name: "すべて" })).toBeInTheDocument();
  });
});

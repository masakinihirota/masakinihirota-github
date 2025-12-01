// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Recommendations Page", () => {
  it("renders RecommendationsPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "あなたへのおすすめ" })).toBeInTheDocument();
  });

  it("displays recommended users section", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: /おすすめのユーザー/i })).toBeInTheDocument();
  });
});

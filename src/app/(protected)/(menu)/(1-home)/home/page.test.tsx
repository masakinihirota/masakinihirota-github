// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Home Page", () => {
  it("renders HomePage component", () => {
    render(<Page />);
    expect(screen.getByText(/ようこそ/)).toBeInTheDocument();
  });

  it("displays quick actions", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "クイックアクション" })).toBeInTheDocument();
  });
});

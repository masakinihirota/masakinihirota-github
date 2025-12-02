// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Human Declaration Page", () => {
  it("renders HumanDeclarationPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "人間宣言" })).toBeInTheDocument();
  });
});

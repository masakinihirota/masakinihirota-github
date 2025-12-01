// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Oasis Declaration Page", () => {
  it("renders OasisDeclarationPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "オアシス宣言" })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Contact Page", () => {
  it("renders ContactPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "お問い合わせ" })).toBeInTheDocument();
  });

  it("displays form title", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "お問い合わせフォーム" })).toBeInTheDocument();
  });
});

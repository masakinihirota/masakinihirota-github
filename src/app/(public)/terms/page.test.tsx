// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Terms Page", () => {
  it("renders TermsOfServicePage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "利用規約" })).toBeInTheDocument();
  });

  it("displays table of contents", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "目次" })).toBeInTheDocument();
  });
});

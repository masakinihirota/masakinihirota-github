// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Admin System Page", () => {
  it("renders AdminSystemPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "システム管理" })).toBeInTheDocument();
  });
});

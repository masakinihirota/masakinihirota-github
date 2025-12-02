// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Admin Penalties Page", () => {
  it("renders AdminPenaltiesPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "ペナルティ管理" })).toBeInTheDocument();
  });
});

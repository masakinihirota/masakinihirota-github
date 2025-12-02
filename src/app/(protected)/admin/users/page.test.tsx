// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Admin Users Page", () => {
  it("renders AdminUsersPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "ユーザー管理" })).toBeInTheDocument();
  });
});

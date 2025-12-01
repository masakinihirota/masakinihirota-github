// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Privacy Page", () => {
  it("renders PrivacyPolicyPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "プライバシーポリシー" })).toBeInTheDocument();
  });
});

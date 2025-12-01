// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Settings Page", () => {
  it("renders SettingsPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "設定" })).toBeInTheDocument();
  });

  it("displays settings tabs", () => {
    render(<Page />);
    expect(screen.getByRole("tab", { name: "アカウント" })).toBeInTheDocument();
  });
});

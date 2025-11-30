/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./mode-toggle";

describe("ModeToggle", () => {
  it("toggles dark class on documentElement when clicked", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="system">
        <ModeToggle />
      </ThemeProvider>
    );

    const btn = screen.getByRole("button", { name: /切り替え: ダーク\/ライト|Toggle theme/i });
    expect(btn).toBeInTheDocument();

    // Initially there should be no explicit 'dark' class on the root
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    // Click to toggle -> should set 'dark'
    await userEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    // Click again -> should remove dark (toggle back to light)
    await userEvent.click(btn);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

import { render, screen } from "@testing-library/react";
/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";

import Sidebar from "@/app/home2/components/Sidebar";

describe("src components - Home2 Sidebar (UI)", () => {
  it("renders brand and nav items for home2", () => {
    render(<Sidebar />);

    const brand = screen.getByRole('link', { name: /home2/i });
    expect(brand).toBeTruthy();
    expect(brand.getAttribute('href')).toBe('/home2');

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /profiles/i })).toBeTruthy();
    expect(screen.getByRole('link', { name: /settings/i })).toBeTruthy();
  });
});

import { render, screen } from "@testing-library/react";
/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";

import Sidebar from "@/app/home3/components/Sidebar";

describe("Home3 Sidebar (UI) - RED test", () => {
  it("renders a Home3 brand, primary links and a notifications badge", () => {
    render(<Sidebar />);

    // brand
    const brand = screen.getByRole('link', { name: /home3/i });
    expect(brand).toBeInTheDocument();
    expect(brand.getAttribute('href')).toBe('/home3');

    // primary links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profiles/i })).toBeInTheDocument();

    // notifications badge (expect a badge element with role=status or data-testid)
    const nb = screen.getByTestId('home3-notifications-badge');
    expect(nb).toBeInTheDocument();
    // numeric content should be parseable
    const value = Number(nb.textContent || "");
    expect(Number.isFinite(value)).toBe(true);
  });
});

import { render, screen } from "@testing-library/react";
/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";

import Sidebar from "./Sidebar";

describe("Home2 Sidebar (UI)", () => {
  it("renders home2 brand and core nav links", () => {
    render(<Sidebar />);

    // brand should render as a link to /home2
    const brand = screen.getByRole('link', { name: /home2/i });
    expect(brand).toBeInTheDocument();
    expect(brand.getAttribute('href')).toBe('/home2');

    // expect primary navigation links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /profiles/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
  });
});

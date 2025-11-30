import { render, screen } from "@testing-library/react";
/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";

import Sidebar from "./Sidebar";

describe("Sidebar (UI)", () => {
  it("renders core items and the post button", () => {
    render(<Sidebar />);
    // branding should render as a link to the authenticated home
    const brandLink = screen.getByRole('link', { name: /masakinihirota/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.getAttribute('href')).toBe('/home');
    // Post button label (Japanese)
    expect(screen.getByText(/ポストする/)).toBeInTheDocument();
  });
});

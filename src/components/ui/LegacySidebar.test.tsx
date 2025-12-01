import { render, screen, fireEvent } from "@testing-library/react";
/** @vitest-environment jsdom */
import { describe, it, expect } from "vitest";

import Sidebar from "./LegacySidebar";

describe("Sidebar (UI)", () => {
  it("renders core items and the post button", () => {
    render(<Sidebar />);
    // branding should render as a link to the authenticated home
    const brandLink = screen.getByRole('link', { name: /masakinihirota/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink.getAttribute('href')).toBe('/home');

    // account menu button should be present
    const accountMenuButton = screen.getByRole('button', { name: /アカウントメニュー/i });
    expect(accountMenuButton).toBeInTheDocument();

    // click to open account menu
    fireEvent.click(accountMenuButton);

    // after clicking, root-accounts link should be visible in the popover
    const rootAccountLinks = screen.getAllByRole('link', { name: /既存のアカウントを追加/i });
    expect(rootAccountLinks.length).toBeGreaterThanOrEqual(1);
    expect(rootAccountLinks[0].getAttribute('href')).toBe('/root-accounts');
  });
});

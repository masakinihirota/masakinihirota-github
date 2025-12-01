import { render, screen } from "@testing-library/react";
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

    // footer should show a single root-account link (bottom-left account) and label it explicitly
    const rootAccountLinks = screen.getAllByRole('link', { name: /ルートアカウント|masakinihirota/i });
    // we expect exactly one root-accounts link (footer). Using regex to match our footer label
    const rootAccountMatch = rootAccountLinks.filter(el => (el.getAttribute('href') || '').includes('/root-accounts'));
    expect(rootAccountMatch.length).toBe(1);
    expect(rootAccountMatch[0].getAttribute('href')).toBe('/root-accounts');
    expect(screen.getByText(/ルートアカウント/)).toBeInTheDocument();
    // There should be a Search link (now rendered where Settings used to be)
    const searchLink = screen.getByTestId('sidebar-search');
    expect(searchLink).toBeInTheDocument();
    expect(searchLink.getAttribute('href')).toBe('/search');

    // Settings should exist (rendered above the root-account/footer)
    const settingsLink = screen.getByTestId('sidebar-settings');
    expect(settingsLink).toBeInTheDocument();

    // Post button label (Japanese)
    expect(screen.getByText(/ポストする/)).toBeInTheDocument();

    // Ensure ordering in DOM: search < settings < root-account
    const allLinks = screen.getAllByRole('link');
    const searchIndex = Array.from(allLinks).findIndex(el => el === searchLink);
    const settingsIndex = Array.from(allLinks).findIndex(el => el === settingsLink);
    const rootIndex = Array.from(allLinks).findIndex(el => el === screen.getByTestId('sidebar-root-account'));
    expect(searchIndex).toBeGreaterThanOrEqual(0);
    expect(settingsIndex).toBeGreaterThanOrEqual(0);
    expect(rootIndex).toBeGreaterThanOrEqual(0);
    expect(searchIndex).toBeLessThan(settingsIndex);
    expect(settingsIndex).toBeLessThan(rootIndex);
  });
});

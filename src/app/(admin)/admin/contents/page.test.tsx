// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Page from "./page";

describe("Admin Content Page", () => {
  it("renders AdminContentPage component", () => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: "コンテンツ管理" })).toBeInTheDocument();
  });
});

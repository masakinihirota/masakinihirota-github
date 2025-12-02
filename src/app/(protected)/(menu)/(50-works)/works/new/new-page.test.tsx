/**
 * 作品登録ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkCreatePage from "./new-page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("WorkCreatePage", () => {
  it("作品登録ページをレンダリングする", () => {
    render(<WorkCreatePage />);

    expect(screen.getByRole("heading", { name: "作品を登録" })).toBeInTheDocument();
  });
});

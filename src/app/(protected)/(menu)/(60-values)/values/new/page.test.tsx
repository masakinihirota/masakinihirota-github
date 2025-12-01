/**
 * 価値観作成ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ValueCreatePage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("ValueCreatePage", () => {
  it("価値観作成ページをレンダリングする", () => {
    render(<ValueCreatePage />);

    expect(screen.getByRole("heading", { name: "価値観を作成" })).toBeInTheDocument();
  });

  it("作成フォームを表示する", () => {
    render(<ValueCreatePage />);

    expect(screen.getByLabelText(/質問/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "作成する" })).toBeInTheDocument();
  });
});

/**
 * 価値観編集ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ValueEditForm } from "./components/ValueEditForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockValue = {
  id: "1",
  title: "テスト価値観",
  category: "life",
  description: "テスト説明",
};

describe("ValueEditPage", () => {
  it("編集フォームをレンダリングする", () => {
    render(<ValueEditForm value={mockValue} />);

    expect(screen.getByRole("heading", { name: "価値観を編集" })).toBeInTheDocument();
  });
});

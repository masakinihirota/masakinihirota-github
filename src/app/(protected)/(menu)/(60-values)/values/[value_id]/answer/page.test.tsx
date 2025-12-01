/**
 * 価値観回答ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ValueAnswerForm } from "./components/ValueAnswerForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockValue = {
  id: "1",
  title: "テスト価値観",
  category: "人生",
  description: "テスト説明",
  myAnswer: undefined,
};

describe("ValueAnswerPage", () => {
  it("回答フォームをレンダリングする", () => {
    render(<ValueAnswerForm value={mockValue} />);

    expect(screen.getByRole("heading", { name: "価値観に回答" })).toBeInTheDocument();
  });
});

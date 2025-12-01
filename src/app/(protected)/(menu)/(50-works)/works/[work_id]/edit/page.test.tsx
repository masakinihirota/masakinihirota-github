/**
 * 作品編集ページ テスト
 *
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkEditForm } from "./components/WorkEditForm";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

const mockWork = {
  id: "1",
  title: "テスト作品",
  author: "テスト作者",
  category: "manga",
};

describe("WorkEditPage", () => {
  it("編集フォームをレンダリングする", () => {
    render(<WorkEditForm work={mockWork} />);

    expect(screen.getByRole("heading", { name: "作品を編集" })).toBeInTheDocument();
  });
});

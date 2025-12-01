// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NationEditForm } from "./NationEditForm";

describe("NationEditForm", () => {
  const mockNation = {
    id: "nation-123",
    name: "Neo Japan",
    slug: "neo-japan",
    flagUrl: "/flag.png",
    themeColor: "#FF0000",
    constitution: "All creators are welcome.",
  };

  it("編集フォームのタイトルを表示する", () => {
    render(<NationEditForm nation={mockNation} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("国を編集");
  });

  it("現在の情報がプリセットされた入力フィールドを表示する", () => {
    render(<NationEditForm nation={mockNation} />);
    expect(screen.getByLabelText(/国名/)).toHaveValue("Neo Japan");
    expect(screen.getByLabelText(/国旗/)).toBeInTheDocument();
    expect(screen.getByLabelText(/テーマカラー/)).toBeInTheDocument();
  });

  it("憲法・理念の編集フィールドを表示する", () => {
    render(<NationEditForm nation={mockNation} />);
    expect(screen.getByLabelText(/憲法/)).toHaveValue("All creators are welcome.");
  });

  it("保存とキャンセルボタンを表示する", () => {
    render(<NationEditForm nation={mockNation} />);
    expect(screen.getByRole("button", { name: /保存/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /キャンセル/ })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { NationManage } from "./NationManage";

describe("NationManage", () => {
  const mockNation = {
    id: "nation-123",
    name: "Neo Japan",
  };

  const mockCitizens = [
    {
      id: "citizen-1",
      name: "山田太郎",
      avatarUrl: "/avatar1.png",
      role: "市民",
      contribution: 500,
      stayDuration: "6ヶ月",
    },
    {
      id: "citizen-2",
      name: "佐藤花子",
      avatarUrl: "/avatar2.png",
      role: "大臣",
      contribution: 1200,
      stayDuration: "1年",
    },
  ];

  it("管理画面のタイトルを表示する", () => {
    render(<NationManage nation={mockNation} citizens={mockCitizens} />);
    expect(screen.getByTestId("page-title")).toHaveTextContent("国政管理");
  });

  it("市民一覧を表示する", () => {
    render(<NationManage nation={mockNation} citizens={mockCitizens} />);
    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText("佐藤花子")).toBeInTheDocument();
    expect(screen.getAllByText(/貢献度/).length).toBeGreaterThan(0);
  });

  it("移住局セクションを表示する", () => {
    render(<NationManage nation={mockNation} citizens={mockCitizens} />);
    expect(screen.getByText("移住局")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /スカウト/ })).toBeInTheDocument();
  });

  it("市民管理アクションを表示する", () => {
    render(<NationManage nation={mockNation} citizens={mockCitizens} />);
    expect(screen.getAllByRole("button", { name: /役職任命/ }).length).toBeGreaterThan(0);
  });
});

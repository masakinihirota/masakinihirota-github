// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizationManage } from "./OrganizationManage";

describe("OrganizationManage", () => {
  const mockOrganization = {
    id: "org-123",
    name: "VNS開発チーム",
  };

  const mockMembers = [
    {
      id: "member-1",
      name: "山田太郎",
      avatarUrl: "/avatar1.png",
      role: "リーダー",
      joinedAt: "2024-01-01",
      penaltyStatus: null,
    },
    {
      id: "member-2",
      name: "佐藤花子",
      avatarUrl: "/avatar2.png",
      role: "マネージャー",
      joinedAt: "2024-02-15",
      penaltyStatus: "warning",
    },
  ];

  it("管理画面のタイトルを表示する", () => {
    render(<OrganizationManage organization={mockOrganization} members={mockMembers} />);
    expect(screen.getByTestId("page-title")).toHaveTextContent("メンバー管理");
  });

  it("メンバー一覧を表示する", () => {
    render(<OrganizationManage organization={mockOrganization} members={mockMembers} />);
    expect(screen.getByText("山田太郎")).toBeInTheDocument();
    expect(screen.getByText("佐藤花子")).toBeInTheDocument();
    expect(screen.getByText("リーダー")).toBeInTheDocument();
    expect(screen.getByText("マネージャー")).toBeInTheDocument();
  });

  it("招待・リクエストセクションを表示する", () => {
    render(<OrganizationManage organization={mockOrganization} members={mockMembers} />);
    expect(screen.getByText("招待・リクエスト")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /メンバーを招待/ })).toBeInTheDocument();
  });

  it("選挙管理セクションを表示する", () => {
    render(<OrganizationManage organization={mockOrganization} members={mockMembers} />);
    expect(screen.getByText("選挙管理")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /選挙を開催/ })).toBeInTheDocument();
  });
});

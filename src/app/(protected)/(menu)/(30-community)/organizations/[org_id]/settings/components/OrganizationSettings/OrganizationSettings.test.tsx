// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizationSettings } from "./OrganizationSettings";

describe("OrganizationSettings", () => {
  const mockOrganization = {
    id: "org-123",
    name: "VNS開発チーム",
    isPublic: true,
    joinPolicy: "approval",
  };

  it("設定画面のタイトルを表示する", () => {
    render(<OrganizationSettings organization={mockOrganization} />);
    expect(screen.getByTestId("page-title")).toHaveTextContent("組織設定");
  });

  it("プロフィール編集セクションを表示する", () => {
    render(<OrganizationSettings organization={mockOrganization} />);
    expect(screen.getByText("プロフィール編集")).toBeInTheDocument();
    expect(screen.getByLabelText(/組織名/)).toBeInTheDocument();
  });

  it("公開・プライバシーセクションを表示する", () => {
    render(<OrganizationSettings organization={mockOrganization} />);
    expect(screen.getByText("公開・プライバシー")).toBeInTheDocument();
    expect(screen.getByLabelText(/公開範囲/)).toBeInTheDocument();
    expect(screen.getByLabelText(/加入設定/)).toBeInTheDocument();
  });

  it("危険な設定セクションを表示する", () => {
    render(<OrganizationSettings organization={mockOrganization} />);
    expect(screen.getByText("危険な設定")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /組織を解散/ })).toBeInTheDocument();
  });
});

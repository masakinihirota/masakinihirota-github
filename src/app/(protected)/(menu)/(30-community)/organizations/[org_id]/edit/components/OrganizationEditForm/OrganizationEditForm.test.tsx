// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizationEditForm } from "./OrganizationEditForm";

describe("OrganizationEditForm", () => {
  const mockOrganization = {
    id: "org-123",
    name: "VNS開発チーム",
    logoUrl: "/logo.png",
    headerUrl: "/header.png",
    vision: "価値観でつながる世界を作る",
    location: "オンライン",
    externalLinks: ["https://example.com"],
  };

  it("編集フォームのタイトルを表示する", () => {
    render(<OrganizationEditForm organization={mockOrganization} />);
    expect(screen.getByTestId("card-title")).toHaveTextContent("組織を編集");
  });

  it("基本情報の入力フィールドを表示する", () => {
    render(<OrganizationEditForm organization={mockOrganization} />);
    expect(screen.getByLabelText(/組織名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ロゴ画像/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ヘッダー画像/)).toBeInTheDocument();
  });

  it("詳細情報の入力フィールドを表示する", () => {
    render(<OrganizationEditForm organization={mockOrganization} />);
    expect(screen.getByLabelText(/ビジョン/)).toBeInTheDocument();
    expect(screen.getByLabelText(/活動拠点/)).toBeInTheDocument();
    expect(screen.getByLabelText(/外部リンク/)).toBeInTheDocument();
  });

  it("保存とキャンセルボタンを表示する", () => {
    render(<OrganizationEditForm organization={mockOrganization} />);
    expect(screen.getByRole("button", { name: /保存/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /キャンセル/ })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationDetail, NotificationDetailData } from "./NotificationDetail";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("NotificationDetail", () => {
  const mockNotification: NotificationDetailData = {
    id: "1",
    subject: "システムメンテナンスのお知らせ",
    sender: "運営チーム",
    receivedAt: "2024-01-15 10:00",
    content: "システムメンテナンスを実施します。\n\n詳細は以下の通りです。",
    isRead: false,
    type: "important",
    attachments: [{ name: "詳細資料.pdf", url: "/files/detail.pdf" }],
  };

  it("件名を表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("システムメンテナンスのお知らせ")).toBeInTheDocument();
  });

  it("送信者を表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("運営チーム")).toBeInTheDocument();
  });

  it("受信日時を表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("2024-01-15 10:00")).toBeInTheDocument();
  });

  it("本文を表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText(/システムメンテナンスを実施します/)).toBeInTheDocument();
  });

  it("通知タイプのバッジを表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("重要")).toBeInTheDocument();
  });

  it("未読バッジを表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("未読")).toBeInTheDocument();
  });

  it("添付ファイルを表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByText("詳細資料.pdf")).toBeInTheDocument();
  });

  it("削除ボタンを表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByRole("button", { name: /削除/i })).toBeInTheDocument();
  });

  it("アーカイブボタンを表示する", () => {
    render(<NotificationDetail notification={mockNotification} />);
    expect(screen.getByRole("button", { name: /アーカイブ/i })).toBeInTheDocument();
  });
});

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import NotificationDetailPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("NotificationDetailPage", () => {
  it("通知詳細をレンダリングする", async () => {
    const params = Promise.resolve({ notification_id: "1" });
    render(await NotificationDetailPage({ params }));
    expect(screen.getByText("システムメンテナンスのお知らせ")).toBeInTheDocument();
  });

  it("一覧に戻るリンクを表示する", async () => {
    const params = Promise.resolve({ notification_id: "1" });
    render(await NotificationDetailPage({ params }));
    expect(screen.getByText("通知一覧に戻る")).toBeInTheDocument();
  });
});

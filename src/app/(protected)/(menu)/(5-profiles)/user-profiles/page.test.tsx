// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfilesPage from "./page";

// モックコンポーネント
vi.mock("./components", () => ({
  ProfileList: ({ profiles }: { profiles: any[] }) => (
    <div data-testid="profile-list">
      {profiles.map((p) => (
        <div key={p.id} data-testid="profile-item">
          {p.displayName}
        </div>
      ))}
    </div>
  ),
}));

describe("ProfilesPage", () => {
  it("renders the profile list with mock data", () => {
    render(<ProfilesPage />);

    // プロフィールリストが表示されているか確認
    expect(screen.getByTestId("profile-list")).toBeDefined();

    // モックデータの人数分表示されているか (3人)
    const items = screen.getAllByTestId("profile-item");
    expect(items).toHaveLength(3);

    // 特定のユーザー名が表示されているか
    expect(screen.getByText("田中太郎")).toBeDefined();
  });
});

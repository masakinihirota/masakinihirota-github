// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { OrganizationDetail } from "./OrganizationDetail"

// テスト用のモックデータ
const mockOrganization = {
  id: "org-1",
  name: "ゲーム開発サークル",
  type: "任意団体",
  purpose: "Game",
  representative: "田中太郎",
  memberCount: 12,
  maxMembers: 30,
  followerCount: 45,
  status: "募集中",
  vision: "楽しいインディーゲームを世界に届ける",
  mission: "週末にメンバーが集まり、アイデアを形にする",
  activities: "ゲームジャム参加、月1回のオンラインミーティング",
  location: "オンライン",
  foundedAt: "2024-01-15",
  description: "インディーゲームを作るサークルです。初心者歓迎！",
  members: [
    { id: "user-1", name: "田中太郎", role: "代表" },
    { id: "user-2", name: "山田花子", role: "副代表" },
    { id: "user-3", name: "鈴木一郎", role: "メンバー" },
  ],
}

describe("OrganizationDetail", () => {
  it("組織名と基本情報が表示される", () => {
    render(<OrganizationDetail organization={mockOrganization} />)

    expect(screen.getByText("ゲーム開発サークル")).toBeInTheDocument()
    expect(screen.getByText("任意団体")).toBeInTheDocument()
    expect(screen.getByText(/代表: 田中太郎/)).toBeInTheDocument()
  })

  it("メンバー数とフォロワー数が表示される", () => {
    render(<OrganizationDetail organization={mockOrganization} />)

    expect(screen.getByText(/12\/30 メンバー/)).toBeInTheDocument()
    expect(screen.getByText(/45 フォロワー/)).toBeInTheDocument()
  })

  it("ビジョン、ミッション、活動内容が表示される", () => {
    render(<OrganizationDetail organization={mockOrganization} />)

    expect(screen.getByText("楽しいインディーゲームを世界に届ける")).toBeInTheDocument()
    expect(screen.getByText("週末にメンバーが集まり、アイデアを形にする")).toBeInTheDocument()
    expect(screen.getByText(/ゲームジャム参加/)).toBeInTheDocument()
  })

  it("フォローボタンと加入リクエストボタンが表示される", () => {
    render(<OrganizationDetail organization={mockOrganization} />)

    expect(screen.getByRole("button", { name: /フォロー/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /加入リクエスト/ })).toBeInTheDocument()
  })
})

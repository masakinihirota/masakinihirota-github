// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { OrganizationList } from "./OrganizationList"

// テスト用のモックデータ
const mockOrganizations = [
  {
    id: "org-1",
    name: "ゲーム開発サークル",
    purpose: "Game",
    memberCount: 12,
    maxMembers: 30,
    status: "募集中",
    leaderName: "田中太郎",
    description: "インディーゲームを作るサークルです",
  },
  {
    id: "org-2",
    name: "プログラミング勉強会",
    purpose: "Work",
    memberCount: 25,
    maxMembers: 50,
    status: "活動中",
    leaderName: "山田花子",
    description: "週末にプログラミングを学ぶ会です",
  },
  {
    id: "org-3",
    name: "写真部",
    purpose: "Hobby",
    memberCount: 5,
    maxMembers: 10,
    status: "準備中",
    leaderName: "鈴木一郎",
    description: "街歩きしながら写真を撮る活動をしています",
  },
]

describe("OrganizationList", () => {
  it("組織一覧のタイトルが表示される", () => {
    render(<OrganizationList organizations={mockOrganizations} />)
    expect(screen.getByText("組織一覧")).toBeInTheDocument()
  })

  it("組織が0件の場合、空状態メッセージが表示される", () => {
    render(<OrganizationList organizations={[]} />)
    expect(screen.getByText("組織が見つかりません")).toBeInTheDocument()
  })

  it("組織カードに組織名、目的、メンバー数、ステータス、リーダー名が表示される", () => {
    render(<OrganizationList organizations={mockOrganizations} />)

    // 組織名
    expect(screen.getByText("ゲーム開発サークル")).toBeInTheDocument()
    expect(screen.getByText("プログラミング勉強会")).toBeInTheDocument()
    expect(screen.getByText("写真部")).toBeInTheDocument()

    // 目的（Purpose）
    expect(screen.getByText("Game")).toBeInTheDocument()
    expect(screen.getByText("Work")).toBeInTheDocument()
    expect(screen.getByText("Hobby")).toBeInTheDocument()

    // メンバー数
    expect(screen.getByText("12/30 メンバー")).toBeInTheDocument()
    expect(screen.getByText("25/50 メンバー")).toBeInTheDocument()
    expect(screen.getByText("5/10 メンバー")).toBeInTheDocument()

    // ステータス
    expect(screen.getByText("募集中")).toBeInTheDocument()
    expect(screen.getByText("活動中")).toBeInTheDocument()
    expect(screen.getByText("準備中")).toBeInTheDocument()

    // リーダー名
    expect(screen.getByText(/田中太郎/)).toBeInTheDocument()
    expect(screen.getByText(/山田花子/)).toBeInTheDocument()
    expect(screen.getByText(/鈴木一郎/)).toBeInTheDocument()
  })

  it("各組織カードに詳細ボタンと参加申請ボタンが表示される", () => {
    render(<OrganizationList organizations={mockOrganizations} />)

    // 詳細ボタン
    const detailButtons = screen.getAllByRole("button", { name: /詳細を見る/ })
    expect(detailButtons).toHaveLength(3)

    // 参加申請ボタン
    const joinButtons = screen.getAllByRole("button", { name: /参加申請/ })
    expect(joinButtons).toHaveLength(3)
  })
})

// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { NationList } from "./NationList"

// テスト用のモックデータ
const mockNations = [
  {
    id: "nation-1",
    name: "サクラ連邦",
    level: "Nation",
    population: 1200,
    organizationCount: 50,
    status: "運営中",
    maintenanceCost: 500,
    description: "協調と革新を重視する大規模コミュニティです",
  },
  {
    id: "nation-2",
    name: "テックシティ",
    level: "City",
    population: 520,
    organizationCount: 25,
    status: "運営中",
    maintenanceCost: 100,
    description: "技術者が集まる都市型コミュニティです",
  },
  {
    id: "nation-3",
    name: "クリエイター村",
    level: "Village",
    population: 80,
    organizationCount: 5,
    status: "建国準備中",
    maintenanceCost: 20,
    description: "創作活動を楽しむ小さな村です",
  },
]

describe("NationList", () => {
  it("国一覧のタイトルが表示される", () => {
    render(<NationList nations={mockNations} />)
    expect(screen.getByText("国一覧")).toBeInTheDocument()
  })

  it("国が0件の場合、空状態メッセージが表示される", () => {
    render(<NationList nations={[]} />)
    expect(screen.getByText("国が見つかりません")).toBeInTheDocument()
  })

  it("国カードに国名、レベル、人口、ステータス、維持費が表示される", () => {
    render(<NationList nations={mockNations} />)

    // 国名
    expect(screen.getByText("サクラ連邦")).toBeInTheDocument()
    expect(screen.getByText("テックシティ")).toBeInTheDocument()
    expect(screen.getByText("クリエイター村")).toBeInTheDocument()

    // レベル
    expect(screen.getByText("Nation")).toBeInTheDocument()
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText("Village")).toBeInTheDocument()

    // 人口
    expect(screen.getByText(/1,200 人/)).toBeInTheDocument()
    expect(screen.getByText(/520 人/)).toBeInTheDocument()
    expect(screen.getByText(/80 人/)).toBeInTheDocument()

    // ステータス
    expect(screen.getAllByText("運営中")).toHaveLength(2)
    expect(screen.getByText("建国準備中")).toBeInTheDocument()

    // 維持費
    expect(screen.getByText(/500pt\/月/)).toBeInTheDocument()
    expect(screen.getByText(/100pt\/月/)).toBeInTheDocument()
    expect(screen.getByText(/20pt\/月/)).toBeInTheDocument()
  })

  it("各国カードに詳細ボタンと加入申請ボタンが表示される", () => {
    render(<NationList nations={mockNations} />)

    // 詳細ボタン
    const detailButtons = screen.getAllByRole("button", { name: /詳細を見る/ })
    expect(detailButtons).toHaveLength(3)

    // 加入申請ボタン
    const joinButtons = screen.getAllByRole("button", { name: /加入申請/ })
    expect(joinButtons).toHaveLength(3)
  })
})

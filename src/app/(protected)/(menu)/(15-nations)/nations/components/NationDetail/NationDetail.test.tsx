// @vitest-environment jsdom
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { NationDetail } from "./NationDetail"

// テスト用のモックデータ
const mockNation = {
  id: "nation-1",
  name: "サクラ連邦",
  level: "City",
  nextLevel: "State",
  levelProgress: 65,
  headOfState: "山田太郎",
  currentMediator: "テック協会",
  population: 1200,
  residentOrganizations: 50,
  totalOrganizations: 75,
  status: "運営中",
  maintenanceCost: 500,
  constitution: "協調と革新を重視し、すべての参加者の価値観を尊重する",
  entryRequirements: "メンバー5人以上の組織であること、過去のペナルティがないこと",
  foundedAt: "2023-06-01",
  description: "多様な価値観を持つ組織が共存する大規模コミュニティです",
  organizations: [
    { id: "org-1", name: "ゲーム開発サークル", type: "常駐", memberCount: 12 },
    { id: "org-2", name: "プログラミング勉強会", type: "入国", memberCount: 25 },
  ],
}

describe("NationDetail", () => {
  it("国名と基本情報が表示される", () => {
    render(<NationDetail nation={mockNation} />)

    expect(screen.getByText("サクラ連邦")).toBeInTheDocument()
    expect(screen.getByText("City")).toBeInTheDocument()
    expect(screen.getByText(/元首: 山田太郎/)).toBeInTheDocument()
  })

  it("人口と組織数が表示される", () => {
    render(<NationDetail nation={mockNation} />)

    expect(screen.getByText(/1,200 人/)).toBeInTheDocument()
    expect(screen.getByText(/50 常駐組織/)).toBeInTheDocument()
  })

  it("憲法/理念と受入条件が表示される", () => {
    render(<NationDetail nation={mockNation} />)

    expect(
      screen.getByText("協調と革新を重視し、すべての参加者の価値観を尊重する")
    ).toBeInTheDocument()
    expect(
      screen.getByText(/メンバー5人以上の組織であること/)
    ).toBeInTheDocument()
  })

  it("入国ボタンと常駐ボタンが表示される", () => {
    render(<NationDetail nation={mockNation} />)

    expect(screen.getByRole("button", { name: /入国/ })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /常駐/ })).toBeInTheDocument()
  })
})

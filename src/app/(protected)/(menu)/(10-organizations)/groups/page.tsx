import { OrganizationList, type Organization } from "./components"

export const metadata = { title: "組織 — masakinihirota" }

// モックデータ（将来的にはAPI/DBから取得）
const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "ゲーム開発サークル",
    purpose: "Game",
    memberCount: 12,
    maxMembers: 30,
    status: "募集中",
    leaderName: "田中太郎",
    description: "インディーゲームを作るサークルです。週末に集まって開発しています。",
  },
  {
    id: "org-2",
    name: "プログラミング勉強会",
    purpose: "Work",
    memberCount: 25,
    maxMembers: 50,
    status: "活動中",
    leaderName: "山田花子",
    description: "週末にプログラミングを学ぶ会です。初心者歓迎！",
  },
  {
    id: "org-3",
    name: "写真部",
    purpose: "Hobby",
    memberCount: 5,
    maxMembers: 10,
    status: "準備中",
    leaderName: "鈴木一郎",
    description: "街歩きしながら写真を撮る活動をしています。",
  },
]

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <OrganizationList organizations={mockOrganizations} />
    </div>
  )
}

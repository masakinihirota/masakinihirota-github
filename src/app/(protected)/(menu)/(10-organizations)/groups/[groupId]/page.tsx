import { OrganizationDetail, type OrganizationDetailData } from "../components"

export const metadata = { title: "組織詳細 — masakinihirota" }

// モックデータ（将来的にはAPI/DBから取得）
const mockOrganization: OrganizationDetailData = {
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
  activities: "ゲームジャム参加、月1回のオンラインミーティング、Discord での情報共有",
  location: "オンライン（Discord）",
  foundedAt: "2024-01-15",
  description:
    "インディーゲームを作るサークルです。プログラマー、デザイナー、サウンドクリエイターなど様々なメンバーが在籍。初心者歓迎！",
  members: [
    { id: "user-1", name: "田中太郎", role: "代表" },
    { id: "user-2", name: "山田花子", role: "副代表" },
    { id: "user-3", name: "鈴木一郎", role: "プログラマー" },
    { id: "user-4", name: "佐藤次郎", role: "デザイナー" },
    { id: "user-5", name: "高橋三郎", role: "サウンド" },
  ],
}

type Props = {
  params: Promise<{ org_id: string }>
}

export default async function OrganizationDetailPage({ params }: Props) {
  const { org_id } = await params

  // 将来的にはorg_idを使ってAPIから組織情報を取得
  console.log("Organization ID:", org_id)

  return (
    <div className="container mx-auto py-6 px-4">
      <OrganizationDetail organization={mockOrganization} />
    </div>
  )
}

import { NationDetail, type NationDetailData } from "../components"

export const metadata = { title: "国詳細 — masakinihirota" }

// モックデータ（将来的にはAPI/DBから取得）
const mockNation: NationDetailData = {
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
  constitution:
    "協調と革新を重視し、すべての参加者の価値観を尊重する。多様性を受け入れ、互いに学び合う文化を育む。",
  entryRequirements:
    "メンバー5人以上の組織であること、過去6ヶ月以内にペナルティがないこと",
  foundedAt: "2023-06-01",
  description:
    "多様な価値観を持つ組織が共存する大規模コミュニティです。ゲーム開発、プログラミング学習、アート制作など様々な活動が行われています。",
  organizations: [
    { id: "org-1", name: "ゲーム開発サークル", type: "常駐", memberCount: 12 },
    { id: "org-2", name: "プログラミング勉強会", type: "常駐", memberCount: 25 },
    { id: "org-3", name: "写真部", type: "入国", memberCount: 8 },
    { id: "org-4", name: "音楽制作チーム", type: "常駐", memberCount: 15 },
    { id: "org-5", name: "デザインスタジオ", type: "入国", memberCount: 10 },
  ],
}

type Props = {
  params: Promise<{ nation_id: string }>
}

export default async function NationDetailPage({ params }: Props) {
  const { nation_id } = await params

  // 将来的にはnation_idを使ってAPIから国情報を取得
  console.log("Nation ID:", nation_id)

  return (
    <div className="container mx-auto py-6 px-4">
      <NationDetail nation={mockNation} />
    </div>
  )
}

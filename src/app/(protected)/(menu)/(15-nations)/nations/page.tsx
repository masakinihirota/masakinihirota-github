import { NationList, type Nation } from "./components"

export const metadata = { title: "国（トップダウン） — masakinihirota" }

// モックデータ（将来的にはAPI/DBから取得）
const mockNations: Nation[] = [
  {
    id: "nation-1",
    name: "サクラ連邦",
    level: "Nation",
    population: 1200,
    organizationCount: 50,
    status: "運営中",
    maintenanceCost: 500,
    description: "協調と革新を重視する大規模コミュニティです。多様な価値観を持つ組織が共存しています。",
  },
  {
    id: "nation-2",
    name: "テックシティ",
    level: "City",
    population: 520,
    organizationCount: 25,
    status: "運営中",
    maintenanceCost: 100,
    description: "技術者が集まる都市型コミュニティです。プログラミングやデータサイエンスを楽しむ組織が多数。",
  },
  {
    id: "nation-3",
    name: "クリエイター村",
    level: "Village",
    population: 80,
    organizationCount: 5,
    status: "建国準備中",
    maintenanceCost: 20,
    description: "創作活動を楽しむ小さな村です。アート、音楽、執筆など様々なクリエイティブ活動をしています。",
  },
]

export default function NationsPage() {
  return (
    <div className="container mx-auto py-6 px-4">
      <NationList nations={mockNations} />
    </div>
  )
}

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Edit, History, FileText, Check, X } from "lucide-react"

/**
 * 国法・宣言管理ページ
 */

// モックデータ
const mockLaws = [
  {
    id: "law-1",
    title: "オアシス宣言",
    type: "declaration",
    status: "active",
    updatedAt: "2025-10-01",
    isCore: true,
  },
  {
    id: "law-2",
    title: "メンバーシップ規約",
    type: "law",
    status: "active",
    updatedAt: "2025-11-15",
    isCore: false,
  },
  {
    id: "law-3",
    title: "コンテンツガイドライン",
    type: "guideline",
    status: "active",
    updatedAt: "2025-11-20",
    isCore: false,
  },
  {
    id: "law-4",
    title: "ペナルティ規定",
    type: "law",
    status: "draft",
    updatedAt: "2025-12-01",
    isCore: false,
  },
]

interface NationLawsPageProps {
  params: Promise<{ nation_id: string }>
}

export default async function NationLawsPage({ params }: NationLawsPageProps) {
  const { nation_id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/nations/${nation_id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">国法・宣言管理</h1>
            <p className="text-muted-foreground mt-1">
              国の法律と宣言を管理します
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          新規法令作成
        </Button>
      </div>

      <div className="grid gap-4">
        {mockLaws.map((law) => (
          <Card key={law.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {law.title}
                      {law.isCore && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          コア
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      タイプ: {law.type === 'declaration' ? '宣言' : law.type === 'law' ? '法律' : 'ガイドライン'}
                    </CardDescription>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  law.status === 'active'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                }`}>
                  {law.status === 'active' ? '有効' : '草稿'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  最終更新: {law.updatedAt}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <History className="mr-2 h-4 w-4" />
                    履歴
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    編集
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

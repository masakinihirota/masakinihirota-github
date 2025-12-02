import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit, Share2, Trash2, Plus, ExternalLink } from "lucide-react"

/**
 * リスト詳細ページ
 */

// モックデータ
const mockList = {
  id: "list-1",
  title: "お気に入り作品リスト",
  description: "これまでに見つけた素晴らしい作品集。様々なジャンルの作品を集めています。",
  type: "favorites",
  isPublic: true,
  createdAt: "2025-10-01",
  updatedAt: "2025-11-28",
  items: [
    { id: "item-1", title: "素晴らしい絵画作品", type: "work", addedAt: "2025-11-28" },
    { id: "item-2", title: "心に響く音楽", type: "work", addedAt: "2025-11-25" },
    { id: "item-3", title: "感動的な物語", type: "work", addedAt: "2025-11-20" },
    { id: "item-4", title: "革新的なデザイン", type: "work", addedAt: "2025-11-15" },
    { id: "item-5", title: "印象的な写真集", type: "work", addedAt: "2025-11-10" },
  ],
}

interface ListDetailPageProps {
  params: Promise<{ listId: string }>
}

export default async function ListDetailPage({ params }: ListDetailPageProps) {
  const { listId } = await params
  // 実際はlistIdを使ってデータを取得
  const list = mockList

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/lists">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{list.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full ${
                list.isPublic
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {list.isPublic ? '公開' : '非公開'}
              </span>
            </div>
            <p className="text-muted-foreground mt-1">{list.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/lists/${listId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              編集
            </Link>
          </Button>
        </div>
      </div>

      {/* メタ情報 */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>作成: {list.createdAt}</span>
        <span>更新: {list.updatedAt}</span>
        <span>{list.items.length} アイテム</span>
      </div>

      {/* アイテム一覧 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>アイテム一覧</CardTitle>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              アイテム追加
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {list.items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground w-6">{index + 1}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">追加日: {item.addedAt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

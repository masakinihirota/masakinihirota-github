import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, BookOpen, Heart, Star, Bookmark } from "lucide-react"

/**
 * リスト一覧ページ
 *
 * 機能:
 * - プレイリスト、推しリスト、TODOリストなどの管理
 * - 新規リスト作成への導線
 * - 公開/非公開リストの管理
 */

// モックデータ
const mockLists = [
  {
    id: "list-1",
    title: "お気に入り作品リスト",
    description: "これまでに見つけた素晴らしい作品集",
    type: "favorites",
    itemCount: 15,
    isPublic: true,
    icon: Heart,
    updatedAt: "2025-11-28",
  },
  {
    id: "list-2",
    title: "読みたい本リスト",
    description: "いつか読みたい本のリスト",
    type: "reading",
    itemCount: 23,
    isPublic: false,
    icon: BookOpen,
    updatedAt: "2025-11-25",
  },
  {
    id: "list-3",
    title: "推しクリエイターリスト",
    description: "応援しているクリエイターたち",
    type: "oshi",
    itemCount: 8,
    isPublic: true,
    icon: Star,
    updatedAt: "2025-11-20",
  },
  {
    id: "list-4",
    title: "やることリスト",
    description: "日々のタスク管理",
    type: "todo",
    itemCount: 5,
    isPublic: false,
    icon: Bookmark,
    updatedAt: "2025-12-01",
  },
]

export default function ListsPage() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">リスト</h1>
          <p className="text-muted-foreground mt-1">
            プレイリスト、推しリスト、TODOリストなどを管理します
          </p>
        </div>
        <Button asChild>
          <Link href="/lists/create">
            <Plus className="mr-2 h-4 w-4" />
            新規リスト作成
          </Link>
        </Button>
      </div>

      {/* リスト一覧 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockLists.map((list) => {
          const IconComponent = list.icon
          return (
            <Card key={list.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">
                      <Link
                        href={`/lists/${list.id}`}
                        className="hover:underline"
                      >
                        {list.title}
                      </Link>
                    </CardTitle>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    list.isPublic
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}>
                    {list.isPublic ? '公開' : '非公開'}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">
                  {list.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{list.itemCount} アイテム</span>
                  <span>更新: {list.updatedAt}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/lists/${list.id}`}>詳細</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/lists/${list.id}/edit`}>編集</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 空の状態 */}
      {mockLists.length === 0 && (
        <Card className="p-8 text-center">
          <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">リストがありません</h3>
          <p className="text-muted-foreground mt-2">
            最初のリストを作成して、お気に入りの作品やコンテンツを整理しましょう。
          </p>
          <Button className="mt-4" asChild>
            <Link href="/lists/create">
              <Plus className="mr-2 h-4 w-4" />
              新規リスト作成
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

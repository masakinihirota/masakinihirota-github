import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Trash2 } from "lucide-react"

/**
 * リスト編集ページ
 */

// モックデータ
const mockList = {
  id: "list-1",
  title: "お気に入り作品リスト",
  description: "これまでに見つけた素晴らしい作品集。様々なジャンルの作品を集めています。",
  type: "favorites",
  isPublic: true,
}

interface ListEditPageProps {
  params: Promise<{ listId: string }>
}

export default async function ListEditPage({ params }: ListEditPageProps) {
  const { listId } = await params
  const list = mockList

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/lists/${listId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">リスト編集</h1>
            <p className="text-muted-foreground mt-1">
              リストの情報を編集します
            </p>
          </div>
        </div>
        <Button variant="destructive" size="sm">
          <Trash2 className="mr-2 h-4 w-4" />
          削除
        </Button>
      </div>

      {/* フォーム */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>リスト情報</CardTitle>
          <CardDescription>
            リストの基本情報を編集してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              defaultValue={list.title}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              defaultValue={list.description}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">リストタイプ</Label>
            <select
              id="type"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={list.type}
            >
              <option value="favorites">お気に入り</option>
              <option value="oshi">推しリスト</option>
              <option value="reading">読みたいリスト</option>
              <option value="todo">TODOリスト</option>
              <option value="custom">カスタム</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              className="rounded border-gray-300"
              defaultChecked={list.isPublic}
            />
            <Label htmlFor="isPublic">このリストを公開する</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/lists/${listId}`}>キャンセル</Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              保存する
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

/**
 * リスト作成ページ
 */
export default function ListCreatePage() {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/lists">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">新規リスト作成</h1>
          <p className="text-muted-foreground mt-1">
            新しいリストを作成します
          </p>
        </div>
      </div>

      {/* フォーム */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>リスト情報</CardTitle>
          <CardDescription>
            リストの基本情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              placeholder="リストのタイトルを入力"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              placeholder="リストの説明を入力（任意）"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">リストタイプ</Label>
            <select
              id="type"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
            />
            <Label htmlFor="isPublic">このリストを公開する</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/lists">キャンセル</Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              作成する
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

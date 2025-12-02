import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

/**
 * 組織編集ページ
 */

// モックデータ
const mockGroup = {
  id: "group-1",
  name: "クリエイティブ組織A",
  description: "デザインとクリエイティブを愛するメンバーが集まる組織です。",
  type: "creative",
  tags: ["デザイン", "クリエイティブ", "アート"],
}

interface GroupEditPageProps {
  params: Promise<{ groupId: string }>
}

export default async function GroupEditPage({ params }: GroupEditPageProps) {
  const { groupId } = await params
  const group = mockGroup

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/groups/${groupId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">組織編集</h1>
          <p className="text-muted-foreground mt-1">
            組織の情報を編集します
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>
            組織の基本情報を編集してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">組織名</Label>
            <Input
              id="name"
              defaultValue={group.name}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea
              id="description"
              defaultValue={group.description}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">組織タイプ</Label>
            <select
              id="type"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue={group.type}
            >
              <option value="creative">クリエイティブ</option>
              <option value="tech">テクノロジー</option>
              <option value="business">ビジネス</option>
              <option value="hobby">趣味</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">タグ（カンマ区切り）</Label>
            <Input
              id="tags"
              defaultValue={group.tags.join(", ")}
              placeholder="タグ1, タグ2, タグ3"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href={`/groups/${groupId}`}>キャンセル</Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

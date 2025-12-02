import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"

/**
 * アカウント設定ページ
 */
export default function AccountSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">アカウント設定</h1>
          <p className="text-muted-foreground mt-1">
            基本的なアカウント情報を管理します
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
          <CardDescription>
            アカウントの基本情報を編集します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                defaultValue="user@example.com"
                className="flex-1"
              />
              <Button variant="outline">変更</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">表示名</Label>
            <Input
              id="displayName"
              defaultValue="ユーザーA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">言語</Label>
            <select
              id="language"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="ja"
            >
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex justify-end">
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

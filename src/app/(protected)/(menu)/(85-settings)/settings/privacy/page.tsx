import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"

/**
 * プライバシー設定ページ
 */
export default function PrivacySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">プライバシー設定</h1>
          <p className="text-muted-foreground mt-1">
            プライバシーに関する設定を管理します
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>公開範囲</CardTitle>
          <CardDescription>
            プロフィールや作品の公開範囲を設定します
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>プロフィールを公開</Label>
              <p className="text-sm text-muted-foreground">
                他のユーザーがあなたのプロフィールを閲覧できます
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>作品を公開</Label>
              <p className="text-sm text-muted-foreground">
                登録した作品を他のユーザーに公開します
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>価値観を公開</Label>
              <p className="text-sm text-muted-foreground">
                価値観の回答を他のユーザーに公開します
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>スキルを公開</Label>
              <p className="text-sm text-muted-foreground">
                スキル情報を他のユーザーに公開します
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>検索に表示</Label>
              <p className="text-sm text-muted-foreground">
                検索結果にあなたのプロフィールを表示します
              </p>
            </div>
            <Switch defaultChecked />
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

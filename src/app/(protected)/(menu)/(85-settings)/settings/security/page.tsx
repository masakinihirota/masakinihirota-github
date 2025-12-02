import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Shield, Key, Smartphone, History } from "lucide-react"

/**
 * セキュリティ設定ページ
 */
export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">セキュリティ設定</h1>
          <p className="text-muted-foreground mt-1">
            アカウントのセキュリティを管理します
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* 二要素認証 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              二要素認証 (MFA)
            </CardTitle>
            <CardDescription>
              追加のセキュリティレイヤーを設定します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">二要素認証を有効にする</p>
                <p className="text-sm text-muted-foreground">
                  ログイン時に認証コードの入力が必要になります
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* パスワード変更 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              パスワード
            </CardTitle>
            <CardDescription>
              パスワードを変更します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">パスワードを変更</Button>
          </CardContent>
        </Card>

        {/* ログイン履歴 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              ログイン履歴
            </CardTitle>
            <CardDescription>
              最近のログインアクティビティを確認します
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Windows - Chrome</p>
                  <p className="text-sm text-muted-foreground">
                    東京, 日本 • 2025-12-02 10:30
                  </p>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  現在のセッション
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">iPhone - Safari</p>
                  <p className="text-sm text-muted-foreground">
                    東京, 日本 • 2025-12-01 18:15
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Mac - Firefox</p>
                  <p className="text-sm text-muted-foreground">
                    大阪, 日本 • 2025-11-30 09:00
                  </p>
                </div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              すべてのセッションを表示
            </Button>
          </CardContent>
        </Card>

        {/* アカウント削除 */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              危険な操作
            </CardTitle>
            <CardDescription>
              この操作は取り消すことができません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">アカウントを削除</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

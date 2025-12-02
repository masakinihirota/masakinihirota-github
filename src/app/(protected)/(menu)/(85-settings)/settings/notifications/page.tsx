import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Bell, Mail, MessageSquare, Megaphone, Save } from "lucide-react"

/**
 * 通知設定ページ
 */
export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">通知設定</h1>
          <p className="text-muted-foreground mt-1">
            通知の受信方法と種類を設定します
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* 通知チャネル */}
        <Card>
          <CardHeader>
            <CardTitle>通知チャネル</CardTitle>
            <CardDescription>
              通知を受け取る方法を選択します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>プッシュ通知</Label>
                  <p className="text-sm text-muted-foreground">
                    ブラウザのプッシュ通知を受け取る
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>メール通知</Label>
                  <p className="text-sm text-muted-foreground">
                    重要な通知をメールで受け取る
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* 通知の種類 */}
        <Card>
          <CardHeader>
            <CardTitle>通知の種類</CardTitle>
            <CardDescription>
              受け取りたい通知の種類を選択します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>マッチング通知</Label>
                  <p className="text-sm text-muted-foreground">
                    新しいマッチングや提案があった時
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>組織からの通知</Label>
                  <p className="text-sm text-muted-foreground">
                    所属組織からのお知らせ
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>システム通知</Label>
                  <p className="text-sm text-muted-foreground">
                    サービスのアップデートやメンテナンス情報
                  </p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>おすすめ通知</Label>
                  <p className="text-sm text-muted-foreground">
                    あなたへのおすすめ作品やユーザー
                  </p>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button>
            <Save className="mr-2 h-4 w-4" />
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}

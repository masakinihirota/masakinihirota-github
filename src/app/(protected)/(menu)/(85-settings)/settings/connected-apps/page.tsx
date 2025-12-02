import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Link2, Plus, Trash2 } from "lucide-react"

/**
 * 連携アプリ設定ページ
 */

// モック連携アプリデータ
const mockConnectedApps = [
  {
    id: "google",
    name: "Google",
    description: "Googleアカウントでログイン",
    connectedAt: "2025-10-01",
    icon: "🔷",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "作品の共有に使用",
    connectedAt: "2025-11-15",
    icon: "𝕏",
  },
]

const availableApps = [
  { id: "github", name: "GitHub", description: "コード作品の連携", icon: "🐙" },
  { id: "discord", name: "Discord", description: "コミュニティ連携", icon: "💬" },
]

export default function ConnectedAppsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">連携アプリ設定</h1>
          <p className="text-muted-foreground mt-1">
            外部サービスとの連携を管理します
          </p>
        </div>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* 連携済みアプリ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              連携済みアプリ
            </CardTitle>
            <CardDescription>
              現在連携しているアプリケーション
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockConnectedApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                      <p className="text-xs text-muted-foreground">
                        連携日: {app.connectedAt}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 連携可能なアプリ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              連携可能なアプリ
            </CardTitle>
            <CardDescription>
              新しく連携できるアプリケーション
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableApps.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{app.icon}</span>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </div>
                  </div>
                  <Button variant="outline">連携する</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

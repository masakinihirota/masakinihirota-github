import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, FileText, UserPlus, UserMinus, Edit, AlertTriangle } from "lucide-react"

/**
 * 国の監査ログビューページ
 */

// モックデータ
const mockAuditLogs = [
  {
    id: "log-1",
    action: "MEMBER_JOIN",
    actorName: "クリエイティブ組織A",
    targetName: null,
    description: "組織が国に参加しました",
    timestamp: "2025-12-02 10:30:00",
    icon: UserPlus,
    severity: "info",
  },
  {
    id: "log-2",
    action: "LAW_UPDATE",
    actorName: "管理者",
    targetName: "メンバーシップ規約",
    description: "法令が更新されました",
    timestamp: "2025-12-01 15:45:00",
    icon: Edit,
    severity: "info",
  },
  {
    id: "log-3",
    action: "MEMBER_EXIT",
    actorName: "テスト組織X",
    targetName: null,
    description: "組織が国から退出しました",
    timestamp: "2025-11-30 09:00:00",
    icon: UserMinus,
    severity: "warning",
  },
  {
    id: "log-4",
    action: "PENALTY_ISSUED",
    actorName: "管理者",
    targetName: "問題組織Y",
    description: "ペナルティが発行されました: ルール違反",
    timestamp: "2025-11-28 14:20:00",
    icon: AlertTriangle,
    severity: "error",
  },
  {
    id: "log-5",
    action: "LAW_CREATE",
    actorName: "管理者",
    targetName: "新ガイドライン",
    description: "新しい法令が作成されました",
    timestamp: "2025-11-25 11:00:00",
    icon: FileText,
    severity: "info",
  },
]

interface NationAuditsPageProps {
  params: Promise<{ nation_id: string }>
}

export default async function NationAuditsPage({ params }: NationAuditsPageProps) {
  const { nation_id } = await params

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/nations/${nation_id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">監査ログ</h1>
          <p className="text-muted-foreground mt-1">
            国内の操作履歴を確認します
          </p>
        </div>
      </div>

      {/* フィルター */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ログを検索..."
                className="pl-10"
              />
            </div>
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">すべてのアクション</option>
              <option value="MEMBER_JOIN">メンバー参加</option>
              <option value="MEMBER_EXIT">メンバー退出</option>
              <option value="LAW_UPDATE">法令更新</option>
              <option value="LAW_CREATE">法令作成</option>
              <option value="PENALTY_ISSUED">ペナルティ発行</option>
            </select>
            <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">すべての期間</option>
              <option value="7">過去7日間</option>
              <option value="30">過去30日間</option>
              <option value="90">過去90日間</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* ログ一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>操作ログ</CardTitle>
          <CardDescription>
            最新の操作履歴（直近50件）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAuditLogs.map((log) => {
              const IconComponent = log.icon
              return (
                <div
                  key={log.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    log.severity === 'error'
                      ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20'
                      : log.severity === 'warning'
                        ? 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20'
                        : ''
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    log.severity === 'error'
                      ? 'bg-red-100 text-red-600'
                      : log.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{log.description}</p>
                        <p className="text-sm text-muted-foreground">
                          実行者: {log.actorName}
                          {log.targetName && <span> • 対象: {log.targetName}</span>}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Button variant="outline" className="w-full mt-4">
            さらに読み込む
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

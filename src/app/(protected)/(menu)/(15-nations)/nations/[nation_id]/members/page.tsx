import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Check, X, Clock, Building2 } from "lucide-react"

/**
 * 国の参加組織管理ページ
 */

// モックデータ
const mockMembers = [
  {
    id: "org-1",
    name: "クリエイティブ組織A",
    status: "resident",
    memberCount: 15,
    joinedAt: "2025-10-01",
    leader: "山田太郎",
  },
  {
    id: "org-2",
    name: "テック組織B",
    status: "resident",
    memberCount: 8,
    joinedAt: "2025-10-15",
    leader: "佐藤花子",
  },
  {
    id: "org-3",
    name: "アート組織C",
    status: "temporary",
    memberCount: 5,
    joinedAt: "2025-11-20",
    expiresAt: "2026-02-20",
    leader: "鈴木一郎",
  },
]

const mockPendingApplications = [
  {
    id: "app-1",
    orgName: "新興組織D",
    appliedAt: "2025-12-01",
    memberCount: 3,
    type: "resident",
    leader: "田中次郎",
  },
]

interface NationMembersPageProps {
  params: Promise<{ nation_id: string }>
}

export default async function NationMembersPage({ params }: NationMembersPageProps) {
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
          <h1 className="text-3xl font-bold">参加組織管理</h1>
          <p className="text-muted-foreground mt-1">
            国に参加している組織を管理します
          </p>
        </div>
      </div>

      {/* 統計 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>常駐組織</CardDescription>
            <CardTitle className="text-3xl">
              {mockMembers.filter(m => m.status === 'resident').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>一時滞在組織</CardDescription>
            <CardTitle className="text-3xl">
              {mockMembers.filter(m => m.status === 'temporary').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>申請待ち</CardDescription>
            <CardTitle className="text-3xl">{mockPendingApplications.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* 申請待ち */}
      {mockPendingApplications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              入国申請待ち
            </CardTitle>
            <CardDescription>
              承認待ちの組織があります
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPendingApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{app.orgName}</p>
                      <p className="text-sm text-muted-foreground">
                        リーダー: {app.leader} • メンバー: {app.memberCount}名
                      </p>
                      <p className="text-sm text-muted-foreground">
                        申請日: {app.appliedAt} • 希望: {app.type === 'resident' ? '常駐' : '一時滞在'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <X className="mr-2 h-4 w-4" />
                      却下
                    </Button>
                    <Button size="sm">
                      <Check className="mr-2 h-4 w-4" />
                      承認
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 参加組織一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            参加組織一覧
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      リーダー: {member.leader} • メンバー: {member.memberCount}名
                    </p>
                    <p className="text-sm text-muted-foreground">
                      参加日: {member.joinedAt}
                      {member.status === 'temporary' && member.expiresAt && (
                        <span className="text-yellow-600"> • 期限: {member.expiresAt}</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === 'resident'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  }`}>
                    {member.status === 'resident' ? '常駐' : '一時滞在'}
                  </span>
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

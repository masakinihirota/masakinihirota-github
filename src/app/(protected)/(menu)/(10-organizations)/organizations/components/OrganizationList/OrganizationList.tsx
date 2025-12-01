"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserCircle } from "lucide-react"

export type Organization = {
  id: string
  name: string
  purpose: "Game" | "Work" | "Hobby" | string
  memberCount: number
  maxMembers: number
  status: "募集中" | "活動中" | "準備中" | string
  leaderName: string
  description: string
}

type OrganizationListProps = {
  organizations: Organization[]
}

export function OrganizationList({ organizations }: OrganizationListProps) {
  // 空状態の表示
  if (organizations.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">組織一覧</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">組織が見つかりません</p>
            <Button variant="outline" className="mt-4">
              新しい組織を作成
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ステータスに応じたバッジの色を決定
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "募集中":
        return "default"
      case "活動中":
        return "secondary"
      case "準備中":
        return "outline"
      default:
        return "default"
    }
  }

  // 目的に応じたバッジの色を決定
  const getPurposeVariant = (purpose: string) => {
    switch (purpose) {
      case "Game":
        return "destructive"
      case "Work":
        return "default"
      case "Hobby":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">組織一覧</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {organizations.map((org) => (
          <Card key={org.id} role="listitem">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{org.name}</CardTitle>
                <Badge variant={getStatusVariant(org.status)}>{org.status}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getPurposeVariant(org.purpose)}>{org.purpose}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* メンバー数 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {org.memberCount}/{org.maxMembers} メンバー
                </span>
              </div>

              {/* リーダー */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <UserCircle className="h-4 w-4" />
                <span>リーダー: {org.leaderName}</span>
              </div>

              {/* 説明 */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {org.description}
              </p>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  詳細を見る
                </Button>
                <Button variant="default" size="sm">
                  参加申請
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

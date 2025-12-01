"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, Coins } from "lucide-react"

export type Nation = {
  id: string
  name: string
  level: "Village" | "City" | "Nation" | string
  population: number
  organizationCount: number
  status: "運営中" | "建国準備中" | string
  maintenanceCost: number
  description: string
}

type NationListProps = {
  nations: Nation[]
}

export function NationList({ nations }: NationListProps) {
  // 空状態の表示
  if (nations.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">国一覧</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">国が見つかりません</p>
            <Button variant="outline" className="mt-4">
              新しい国を建国
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ステータスに応じたバッジの色を決定
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "運営中":
        return "default"
      case "建国準備中":
        return "secondary"
      default:
        return "outline"
    }
  }

  // レベルに応じたバッジの色を決定
  const getLevelVariant = (level: string) => {
    switch (level) {
      case "Nation":
        return "destructive"
      case "City":
        return "default"
      case "Village":
        return "secondary"
      default:
        return "outline"
    }
  }

  // 数値をカンマ区切りでフォーマット
  const formatNumber = (num: number) => {
    return num.toLocaleString("ja-JP")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">国一覧</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {nations.map((nation) => (
          <Card key={nation.id} role="listitem">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{nation.name}</CardTitle>
                <Badge variant={getStatusVariant(nation.status)}>
                  {nation.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getLevelVariant(nation.level)}>
                  {nation.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 人口 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{formatNumber(nation.population)} 人</span>
              </div>

              {/* 維持費 */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span>維持費: {formatNumber(nation.maintenanceCost)}pt/月</span>
              </div>

              {/* 説明 */}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {nation.description}
              </p>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  詳細を見る
                </Button>
                <Button variant="default" size="sm">
                  加入申請
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Globe,
  Users,
  UserCircle,
  Building2,
  Coins,
  Calendar,
  ScrollText,
  Shield,
  DoorOpen,
  Home,
} from "lucide-react"

export type NationOrganization = {
  id: string
  name: string
  type: "常駐" | "入国" | string
  memberCount: number
}

export type NationDetailData = {
  id: string
  name: string
  level: "Village" | "Town" | "City" | "State" | string
  nextLevel: string
  levelProgress: number
  headOfState: string
  currentMediator: string
  population: number
  residentOrganizations: number
  totalOrganizations: number
  status: string
  maintenanceCost: number
  constitution: string
  entryRequirements: string
  foundedAt: string
  description: string
  organizations: NationOrganization[]
}

type NationDetailProps = {
  nation: NationDetailData
}

export function NationDetail({ nation }: NationDetailProps) {
  // 日付をフォーマット
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // 数値をカンマ区切りでフォーマット
  const formatNumber = (num: number) => {
    return num.toLocaleString("ja-JP")
  }

  // レベルに応じたバッジの色を決定
  const getLevelVariant = (level: string) => {
    switch (level) {
      case "State":
        return "destructive"
      case "City":
        return "default"
      case "Town":
        return "secondary"
      case "Village":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* ヘッダーエリア */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl bg-primary/10">
                  <Globe className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{nation.name}</CardTitle>
                  <Badge variant={getLevelVariant(nation.level)}>
                    {nation.level}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4" />
                  <span>元首: {nation.headOfState}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>調停者: {nation.currentMediator}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <DoorOpen className="h-4 w-4 mr-2" />
                入国
              </Button>
              <Button>
                <Home className="h-4 w-4 mr-2" />
                常駐
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* レベル進捗 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>次のランク: {nation.nextLevel}</span>
              <span>{nation.levelProgress}%</span>
            </div>
            <Progress value={nation.levelProgress} className="h-2" />
          </div>

          {/* 統計情報 */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{formatNumber(nation.population)} 人</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span>{nation.residentOrganizations} 常駐組織</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-muted-foreground" />
              <span>維持費: {formatNumber(nation.maintenanceCost)}pt/月</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>建国: {formatDate(nation.foundedAt)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 憲法/理念 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ScrollText className="h-5 w-5" />
            憲法/理念
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{nation.constitution}</p>
        </CardContent>
      </Card>

      {/* 受入条件 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            受入条件（簡易ルール）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{nation.entryRequirements}</p>
        </CardContent>
      </Card>

      {/* 所属組織一覧 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            所属組織 ({nation.organizations.length}組織)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {nation.organizations.map((org) => (
              <div
                key={org.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{org.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {org.memberCount}人
                  </p>
                </div>
                <Badge variant={org.type === "常駐" ? "default" : "secondary"}>
                  {org.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 説明 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">説明</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{nation.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}

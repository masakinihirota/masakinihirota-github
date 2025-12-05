"use client"

/**
 * 国ダッシュボードコンポーネント
 * 設計書: 0130-02-国の内政設計書.md
 *
 * 機能:
 * - 国の基本情報表示
 * - レベル進捗バー
 * - メンバー一覧
 * - 統計情報
 * - クイックアクション
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Crown,
  Users,
  Building2,
  Wallet,
  Settings,
  TrendingUp,
  Shield,
  MapPin,
  Calendar,
  AlertCircle,
  ArrowUpRight,
  Star,
} from "lucide-react"

// =====================================================
// 型定義
// =====================================================

export interface NationMember {
  id: string
  userId: string
  displayName: string
  avatarUrl?: string
  role: "owner" | "admin" | "moderator" | "member"
  joinedAt: string
  contribution: number
}

export interface NationStats {
  totalMembers: number
  activeMembersToday: number
  totalBlocks: number
  treasuryBalance: number
  averageContribution: number
  completedTasks: number
  pendingTasks: number
}

export interface NationDashboardProps {
  nation: {
    id: string
    name: string
    description: string
    level: string
    population: number
    maxPopulation: number
    blocks: number
    maxBlocks: number
    maintenanceCost: number
    status: string
    createdAt: string
    ownerId: string
    ownerName: string
  }
  members?: NationMember[]
  stats?: NationStats
  isOwner?: boolean
  isAdmin?: boolean
  onSettings?: () => void
  onBank?: () => void
  onMarket?: () => void
  onMap?: () => void
  onLeave?: () => void
}

// =====================================================
// ヘルパー関数
// =====================================================

const formatNumber = (num: number): string => {
  return num.toLocaleString("ja-JP")
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

const getRoleBadgeVariant = (role: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (role) {
    case "owner":
      return "default"
    case "admin":
      return "secondary"
    case "moderator":
      return "outline"
    default:
      return "outline"
  }
}

const getRoleLabel = (role: string): string => {
  switch (role) {
    case "owner":
      return "オーナー"
    case "admin":
      return "管理者"
    case "moderator":
      return "モデレーター"
    default:
      return "メンバー"
  }
}

const getLevelLabel = (level: string): string => {
  const labels: Record<string, string> = {
    group: "グループ",
    club: "クラブ",
    village: "村",
    town: "町",
    city: "市",
    region: "地方",
    state: "州",
    nation: "国",
  }
  return labels[level] || level
}

const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "active":
      return "default"
    case "inactive":
      return "secondary"
    case "suspended":
      return "destructive"
    default:
      return "outline"
  }
}

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active":
      return "アクティブ"
    case "inactive":
      return "非アクティブ"
    case "suspended":
      return "停止中"
    default:
      return status
  }
}

// =====================================================
// サブコンポーネント
// =====================================================

function LevelProgress({
  currentLevel,
  population,
  maxPopulation,
  blocks,
  maxBlocks,
}: {
  currentLevel: string
  population: number
  maxPopulation: number
  blocks: number
  maxBlocks: number
}) {
  const populationProgress = (population / maxPopulation) * 100
  const blocksProgress = (blocks / maxBlocks) * 100

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          レベル進捗
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{getLevelLabel(currentLevel)}</span>
          <Badge variant="outline" className="text-xs">
            次: {getLevelLabel(getNextLevel(currentLevel))}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">人口</span>
            <span>
              {formatNumber(population)} / {formatNumber(maxPopulation)}
            </span>
          </div>
          <Progress value={populationProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">領土ブロック</span>
            <span>
              {formatNumber(blocks)} / {formatNumber(maxBlocks)}
            </span>
          </div>
          <Progress value={blocksProgress} className="h-2" />
        </div>

        <p className="text-xs text-muted-foreground">
          人口上限に達すると次のレベルに昇格できます
        </p>
      </CardContent>
    </Card>
  )
}

function getNextLevel(currentLevel: string): string {
  const levels = ["group", "club", "village", "town", "city", "region", "state", "nation"]
  const currentIndex = levels.indexOf(currentLevel)
  if (currentIndex === -1 || currentIndex === levels.length - 1) return "最大"
  return levels[currentIndex + 1]
}

function MemberList({ members }: { members: NationMember[] }) {
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = ["owner", "admin", "moderator", "member"]
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
  })

  return (
    <div className="space-y-3">
      {sortedMembers.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.avatarUrl} alt={member.displayName} />
              <AvatarFallback>
                {member.displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{member.displayName}</span>
                <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                  {getRoleLabel(member.role)}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(member.joinedAt)}から参加
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-3 w-3 text-yellow-500" />
              <span>{formatNumber(member.contribution)}</span>
            </div>
            <span className="text-xs text-muted-foreground">貢献度</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatsCard({ stats }: { stats: NationStats }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Users className="h-4 w-4" />
          <span>メンバー数</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{formatNumber(stats.totalMembers)}</div>
        <div className="text-xs text-green-600">
          本日アクティブ: {stats.activeMembersToday}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <MapPin className="h-4 w-4" />
          <span>領土</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{formatNumber(stats.totalBlocks)}</div>
        <div className="text-xs text-muted-foreground">ブロック</div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Wallet className="h-4 w-4" />
          <span>国庫残高</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{formatNumber(stats.treasuryBalance)}</div>
        <div className="text-xs text-muted-foreground">ポイント</div>
      </div>

      <div className="p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Building2 className="h-4 w-4" />
          <span>タスク</span>
        </div>
        <div className="mt-1 text-2xl font-bold">{stats.completedTasks}</div>
        <div className="text-xs text-yellow-600">
          保留中: {stats.pendingTasks}
        </div>
      </div>
    </div>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

export function NationDashboard({
  nation,
  members = [],
  stats,
  isOwner = false,
  isAdmin = false,
  onSettings,
  onBank,
  onMarket,
  onMap,
  onLeave,
}: NationDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const defaultStats: NationStats = stats || {
    totalMembers: nation.population,
    activeMembersToday: Math.floor(nation.population * 0.3),
    totalBlocks: nation.blocks,
    treasuryBalance: 0,
    averageContribution: 0,
    completedTasks: 0,
    pendingTasks: 0,
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{nation.name}</h1>
            <Badge variant={getStatusVariant(nation.status)}>
              {getStatusLabel(nation.status)}
            </Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{nation.description}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Crown className="h-4 w-4" />
              オーナー: {nation.ownerName}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              設立: {formatDate(nation.createdAt)}
            </span>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="flex items-center gap-2">
          {(isOwner || isAdmin) && onSettings && (
            <Button variant="outline" onClick={onSettings}>
              <Settings className="h-4 w-4 mr-2" />
              設定
            </Button>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左側: レベル進捗 + アクション */}
        <div className="space-y-6">
          <LevelProgress
            currentLevel={nation.level}
            population={nation.population}
            maxPopulation={nation.maxPopulation}
            blocks={nation.blocks}
            maxBlocks={nation.maxBlocks}
          />

          {/* クイックアクション */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">クイックアクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {onBank && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onBank}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  銀行を開く
                  <ArrowUpRight className="h-4 w-4 ml-auto" />
                </Button>
              )}
              {onMarket && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onMarket}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  マーケットを見る
                  <ArrowUpRight className="h-4 w-4 ml-auto" />
                </Button>
              )}
              {onMap && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={onMap}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  領土マップ
                  <ArrowUpRight className="h-4 w-4 ml-auto" />
                </Button>
              )}
              {!isOwner && onLeave && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={onLeave}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  国を脱退する
                </Button>
              )}
            </CardContent>
          </Card>

          {/* 維持費情報 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                維持費
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(nation.maintenanceCost)}
                <span className="text-sm text-muted-foreground ml-1">
                  ポイント/月
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                維持費が支払われない場合、国は休止状態になります
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 右側: タブコンテンツ */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <CardHeader className="pb-0">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">
                    統計
                  </TabsTrigger>
                  <TabsTrigger value="members" className="flex-1">
                    メンバー ({members.length})
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex-1">
                    活動履歴
                  </TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent className="pt-6">
                <TabsContent value="overview" className="mt-0">
                  <StatsCard stats={defaultStats} />
                </TabsContent>

                <TabsContent value="members" className="mt-0">
                  {members.length > 0 ? (
                    <MemberList members={members} />
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      メンバー情報がありません
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="activity" className="mt-0">
                  <div className="text-center py-8 text-muted-foreground">
                    活動履歴は実装予定です
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NationDashboard

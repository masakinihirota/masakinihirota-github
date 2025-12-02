import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Star, Gift, ChevronRight, Calendar } from "lucide-react"

/**
 * 実績ページ - ユーザーの達成実績を表示
 */

// モックデータ
const achievements = [
  {
    id: "ach-1",
    title: "プロフィール完成",
    description: "すべてのプロフィール項目を入力しました",
    icon: "🎯",
    earnedAt: "2025-12-01",
    points: 100,
    category: "profile",
  },
  {
    id: "ach-2",
    title: "初めてのマッチング",
    description: "マッチングが成立しました",
    icon: "🤝",
    earnedAt: "2025-11-28",
    points: 50,
    category: "matching",
  },
  {
    id: "ach-3",
    title: "価値観探求者",
    description: "10個の価値観に回答しました",
    icon: "💎",
    earnedAt: "2025-11-25",
    points: 75,
    category: "values",
  },
  {
    id: "ach-4",
    title: "作品投稿者",
    description: "最初の作品を投稿しました",
    icon: "🎨",
    earnedAt: "2025-11-20",
    points: 50,
    category: "works",
  },
]

const lockedAchievements = [
  {
    id: "lock-1",
    title: "組織リーダー",
    description: "組織を作成しリーダーになる",
    icon: "👑",
    points: 200,
    requirement: "組織を作成",
  },
  {
    id: "lock-2",
    title: "国民代表",
    description: "国に参加する",
    icon: "🏛️",
    points: 150,
    requirement: "国に参加",
  },
  {
    id: "lock-3",
    title: "マッチングマスター",
    description: "10回のマッチングを成功させる",
    icon: "⭐",
    points: 300,
    requirement: "あと8回",
  },
]

const stats = {
  totalPoints: 275,
  achievementsUnlocked: 4,
  achievementsTotal: 20,
  currentStreak: 7,
}

export default function AchievementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">実績</h1>
        <p className="text-muted-foreground mt-1">
          あなたの達成記録と獲得ポイントを確認できます
        </p>
      </div>

      {/* 統計サマリー */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Trophy className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalPoints}</p>
                <p className="text-sm text-muted-foreground">獲得ポイント</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Medal className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.achievementsUnlocked}/{stats.achievementsTotal}</p>
                <p className="text-sm text-muted-foreground">実績解除</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.currentStreak}日</p>
                <p className="text-sm text-muted-foreground">連続ログイン</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">シルバー</p>
                <p className="text-sm text-muted-foreground">現在のランク</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 獲得済み実績 */}
      <Card>
        <CardHeader>
          <CardTitle>獲得済み実績</CardTitle>
          <CardDescription>
            これまでに達成した実績の一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start gap-4 p-4 border rounded-lg bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-900/10"
              >
                <div className="text-3xl">{ach.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{ach.title}</h3>
                    <span className="text-sm font-medium text-amber-600">+{ach.points}pt</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">達成日: {ach.earnedAt}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 未獲得実績 */}
      <Card>
        <CardHeader>
          <CardTitle>未獲得実績</CardTitle>
          <CardDescription>
            これから挑戦できる実績
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {lockedAchievements.map((ach) => (
              <div
                key={ach.id}
                className="flex items-start gap-4 p-4 border rounded-lg opacity-60"
              >
                <div className="text-3xl grayscale">{ach.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{ach.title}</h3>
                    <span className="text-sm text-muted-foreground">+{ach.points}pt</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                  <p className="text-xs text-primary mt-1">条件: {ach.requirement}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* リンク */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/tutorial">
            チュートリアルで実績を獲得
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/pricing">
            ポイントの使い道を見る
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

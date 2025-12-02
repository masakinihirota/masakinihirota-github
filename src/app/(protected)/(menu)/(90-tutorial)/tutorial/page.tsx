import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, CheckCircle, Circle, ChevronRight, Play } from "lucide-react"

/**
 * チュートリアルページ - ステップバイステップガイド
 */

// モックデータ
const tutorialSteps = [
  {
    id: "step-1",
    title: "プロフィールを作成する",
    description: "基本情報を入力して、あなたを他のユーザーに紹介しましょう",
    completed: true,
    href: "/user-profiles",
    duration: "5分",
    points: 50,
  },
  {
    id: "step-2",
    title: "価値観に回答する",
    description: "価値観診断に回答して、あなたの考え方を明確にしましょう",
    completed: true,
    href: "/values",
    duration: "10分",
    points: 75,
  },
  {
    id: "step-3",
    title: "スキルを登録する",
    description: "あなたの持っているスキルを登録しましょう",
    completed: false,
    href: "/skills",
    duration: "5分",
    points: 50,
  },
  {
    id: "step-4",
    title: "作品を投稿する",
    description: "ポートフォリオとなる作品を投稿しましょう",
    completed: false,
    href: "/works/new",
    duration: "10分",
    points: 100,
  },
  {
    id: "step-5",
    title: "マッチングを試す",
    description: "AIによるマッチング提案を確認してみましょう",
    completed: false,
    href: "/matching",
    duration: "5分",
    points: 50,
  },
  {
    id: "step-6",
    title: "組織に参加する",
    description: "興味のある組織を探して参加しましょう",
    completed: false,
    href: "/groups",
    duration: "5分",
    points: 75,
  },
]

const completedSteps = tutorialSteps.filter(s => s.completed).length
const totalSteps = tutorialSteps.length
const progressPercent = Math.round((completedSteps / totalSteps) * 100)

export default function TutorialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">チュートリアル</h1>
        <p className="text-muted-foreground mt-1">
          ステップに沿ってサービスの使い方を学びましょう
        </p>
      </div>

      {/* 進捗状況 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-semibold">進捗状況</p>
              <p className="text-sm text-muted-foreground">
                {completedSteps}/{totalSteps} ステップ完了
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{progressPercent}%</p>
              <p className="text-sm text-muted-foreground">完了</p>
            </div>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* ステップリスト */}
      <Card>
        <CardHeader>
          <CardTitle>チュートリアルステップ</CardTitle>
          <CardDescription>
            各ステップを完了するとポイントが獲得できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tutorialSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                  step.completed
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex-shrink-0 pt-0.5">
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-muted-foreground text-sm font-medium">
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${step.completed ? 'text-green-700 dark:text-green-400' : ''}`}>
                      {step.title}
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      +{step.points}pt
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-muted-foreground">
                      所要時間: 約{step.duration}
                    </span>
                    {!step.completed && (
                      <Button size="sm" asChild>
                        <Link href={step.href}>
                          <Play className="h-3 w-3 mr-1" />
                          始める
                        </Link>
                      </Button>
                    )}
                    {step.completed && (
                      <Button size="sm" variant="outline" asChild>
                        <Link href={step.href}>
                          確認する
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 追加リソース */}
      <Card>
        <CardHeader>
          <CardTitle>その他のヘルプ</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/help/faq">
              よくある質問
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/help/contact">
              サポートに問い合わせ
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

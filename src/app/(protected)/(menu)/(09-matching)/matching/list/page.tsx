import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, UserPlus, ChevronRight } from "lucide-react"

/**
 * 手動マッチング比較ページ
 * AIマッチングとは別に、手動で候補者を比較・検索する
 */

// モックデータ
const mockCandidates = [
  {
    id: "cand-1",
    displayName: "クリエイターA",
    bio: "デザインとイラストを専門としています。Web制作やロゴデザインが得意。",
    tags: ["デザイン", "イラスト", "Web制作"],
    matchScore: 85,
    mutualPoints: 3,
  },
  {
    id: "cand-2",
    displayName: "エンジニアB",
    bio: "フロントエンド開発が専門です。React/Next.jsを使ったモダンなWeb開発を行っています。",
    tags: ["フロントエンド", "React", "TypeScript"],
    matchScore: 78,
    mutualPoints: 5,
  },
  {
    id: "cand-3",
    displayName: "ライターC",
    bio: "技術記事やコピーライティングを手がけています。分かりやすい文章を書くことが得意です。",
    tags: ["ライティング", "コピー", "技術記事"],
    matchScore: 65,
    mutualPoints: 2,
  },
  {
    id: "cand-4",
    displayName: "プロジェクトマネージャーD",
    bio: "IT系のPM経験5年以上。アジャイル開発やチームビルディングが得意です。",
    tags: ["PM", "アジャイル", "マネジメント"],
    matchScore: 72,
    mutualPoints: 4,
  },
]

const skillFilters = [
  "デザイン",
  "開発",
  "ライティング",
  "マネジメント",
  "マーケティング",
  "翻訳",
]

export default function MatchingListPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/matching">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">手動マッチング</h1>
          <p className="text-muted-foreground mt-1">
            自分で候補者を検索・比較してマッチングを行います
          </p>
        </div>
      </div>

      {/* 検索・フィルター */}
      <Card>
        <CardHeader>
          <CardTitle>検索条件</CardTitle>
          <CardDescription>
            キーワードやスキルで候補者を絞り込みます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="名前やスキルで検索..."
              className="pl-10"
            />
          </div>
          <div>
            <p className="text-sm font-medium mb-2">スキルフィルター:</p>
            <div className="flex flex-wrap gap-2">
              {skillFilters.map((skill) => (
                <Button key={skill} variant="outline" size="sm">
                  {skill}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 候補者リスト */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">候補者一覧（{mockCandidates.length}件）</h2>

        {mockCandidates.map((candidate) => (
          <Card key={candidate.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium">
                      {candidate.displayName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{candidate.displayName}</h3>
                      <p className="text-sm text-muted-foreground">
                        マッチ度: {candidate.matchScore}% • 共通ポイント: {candidate.mutualPoints}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-3">{candidate.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {candidate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" className="gap-1">
                    <UserPlus className="h-4 w-4" />
                    マッチング申請
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/profile/${candidate.id}`} className="flex items-center gap-1">
                      プロフィール
                      <ChevronRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ページネーション */}
      <div className="flex justify-center gap-2">
        <Button variant="outline" disabled>
          前へ
        </Button>
        <Button variant="outline">
          1
        </Button>
        <Button variant="outline">
          2
        </Button>
        <Button variant="outline">
          3
        </Button>
        <Button variant="outline">
          次へ
        </Button>
      </div>
    </div>
  )
}

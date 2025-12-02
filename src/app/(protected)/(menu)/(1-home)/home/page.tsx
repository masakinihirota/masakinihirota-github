import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * ホームページ（ダッシュボード）
 *
 * 要件定義書に基づく機能:
 * - タイムライン/フィード（メインコンテンツ）
 * - マンダラチャート進捗ウィジェット
 * - ステータス概要ウィジェット
 * - トレンド/おすすめウィジェット
 */

// モックデータ
const mockPosts = [
  {
    id: "1",
    user: { name: "田中太郎", handle: "@tanaka", avatar: "T" },
    content: "新しい作品を投稿しました！価値観を大切にしたクリエイターファースト設計です。",
    time: "2時間前",
    likes: 15,
    comments: 3,
  },
  {
    id: "2",
    user: { name: "佐藤花子", handle: "@sato", avatar: "S" },
    content: "マッチングで素敵な組織と出会えました。感謝！",
    time: "5時間前",
    likes: 42,
    comments: 8,
  },
  {
    id: "3",
    user: { name: "鈴木一郎", handle: "@suzuki", avatar: "鈴" },
    content: "マンダラチャートを完成させました。目標達成に向けて頑張ります！",
    time: "昨日",
    likes: 28,
    comments: 5,
  },
]

const mockMandalaProgress = {
  completed: 5,
  total: 9,
  percentage: 56,
}

const mockStatus = {
  level: 12,
  points: 1250,
  contributions: 45,
  rank: "シルバー",
}

const mockTrends = [
  { tag: "#クリエイターファースト", posts: 1234 },
  { tag: "#価値観マッチング", posts: 856 },
  { tag: "#オアシス宣言", posts: 543 },
]

const mockRecommendations = [
  { name: "クリエイティブ組織A", type: "organization" },
  { name: "山田次郎", type: "user" },
  { name: "デザイン国B", type: "nation" },
]

export default function HomePage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* メインコンテンツ: タイムライン (2カラム分) */}
      <div className="lg:col-span-2 space-y-6">
        {/* 投稿入力エリア */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                M
              </div>
              <div className="flex-1">
                <textarea
                  placeholder="今何してる？"
                  className="w-full min-h-20 p-3 rounded-lg border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                    投稿する
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* タイムライン */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">タイムライン</h2>
          {mockPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold shrink-0">
                    {post.user.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{post.user.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {post.user.handle}
                      </span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {post.time}
                      </span>
                    </div>
                    <p className="mt-2 text-foreground">{post.content}</p>
                    <div className="flex gap-6 mt-4 text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                        <span>♡</span>
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <span>💬</span>
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="hover:text-primary transition-colors">
                        <span>↗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ウィジェットエリア (1カラム分) */}
      <div className="space-y-6">
        {/* マンダラチャート進捗 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">マンダラチャート</CardTitle>
            <CardDescription>目標達成進捗</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-1 mb-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-sm ${
                    i < mockMandalaProgress.completed
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">進捗</span>
              <span className="font-medium">{mockMandalaProgress.percentage}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full mt-2">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${mockMandalaProgress.percentage}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* ステータス概要 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">ステータス</CardTitle>
            <CardDescription>あなたの現在の状況</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-primary">
                  Lv.{mockStatus.level}
                </div>
                <div className="text-xs text-muted-foreground">レベル</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-amber-500">
                  {mockStatus.points.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">ポイント</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-green-500">
                  {mockStatus.contributions}
                </div>
                <div className="text-xs text-muted-foreground">貢献</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-2xl font-bold text-slate-400">
                  {mockStatus.rank}
                </div>
                <div className="text-xs text-muted-foreground">ランク</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* トレンド */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">トレンド</CardTitle>
            <CardDescription>話題のトピック</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockTrends.map((trend, i) => (
                <li key={trend.tag}>
                  <a
                    href={`/home/search?q=${encodeURIComponent(trend.tag)}`}
                    className="block hover:bg-muted/50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <div className="text-xs text-muted-foreground">
                      {i + 1}・トレンド
                    </div>
                    <div className="font-medium text-primary">{trend.tag}</div>
                    <div className="text-xs text-muted-foreground">
                      {trend.posts.toLocaleString()} 件の投稿
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* おすすめ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">おすすめ</CardTitle>
            <CardDescription>あなたへのレコメンド</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockRecommendations.map((rec) => (
                <li key={rec.name}>
                  <a
                    href="#"
                    className="flex items-center gap-3 hover:bg-muted/50 -mx-2 px-2 py-2 rounded transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold">
                      {rec.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{rec.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {rec.type === "organization"
                          ? "組織"
                          : rec.type === "nation"
                          ? "国"
                          : "ユーザー"}
                      </div>
                    </div>
                    <button className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
                      フォロー
                    </button>
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

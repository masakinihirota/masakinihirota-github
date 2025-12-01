/**
 * MatchingTop コンポーネント
 *
 * マッチングトップ画面を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - マッチングチケット残数の表示
 * - 「マッチングを開始する」ボタン
 * - モード選択（通常/プレミアム）
 * - マッチングの説明表示
 * - 成功事例の表示
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type MatchingStatus = {
  ticketCount: number;
  lastMatchDate?: string;
  hasProfile: boolean;
};

type MatchingTopProps = {
  status: MatchingStatus;
};

export const MatchingTop = ({ status }: MatchingTopProps) => {
  const canStartMatching = status.hasProfile && status.ticketCount > 0;

  return (
    <div className="space-y-8">
      {/* ヘッダーエリア */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">マッチング</h1>
          <p className="text-muted-foreground mt-1">
            価値観でつながる、運命の出会いを見つけよう
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">チケット残数:</span>
            <Badge variant={status.ticketCount > 0 ? "default" : "destructive"}>
              {status.ticketCount}枚
            </Badge>
          </div>
          {status.lastMatchDate && (
            <Link
              href="/matching/results"
              className="text-sm text-primary hover:underline"
            >
              前回の結果を見る →
            </Link>
          )}
        </div>
      </div>

      {/* プロフィール未作成の警告 */}
      {!status.hasProfile && (
        <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium">プロフィールを作成してください</p>
                <p className="text-sm text-muted-foreground">
                  マッチングを開始するには、まずプロフィールを作成する必要があります。
                </p>
              </div>
              <Button asChild className="ml-auto">
                <Link href="/profiles/new">プロフィール作成</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* メインアクション */}
      <Card className="border-2 border-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">マッチングを開始する</CardTitle>
          <CardDescription>
            あなたの価値観に合った人を見つけましょう
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* モード選択 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  💫 通常マッチング
                  <Badge variant="outline">1チケット</Badge>
                </CardTitle>
                <CardDescription>
                  基本的な価値観マッチングを実行します
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  disabled={!canStartMatching}
                  asChild={canStartMatching}
                >
                  {canStartMatching ? (
                    <Link href="/matching/settings?mode=normal">開始する</Link>
                  ) : (
                    "開始する"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-amber-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  ✨ プレミアムマッチング
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                    3チケット
                  </Badge>
                </CardTitle>
                <CardDescription>
                  より詳細な分析で高精度なマッチングを実現
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant="secondary"
                  disabled={!canStartMatching || status.ticketCount < 3}
                  asChild={canStartMatching && status.ticketCount >= 3}
                >
                  {canStartMatching && status.ticketCount >= 3 ? (
                    <Link href="/matching/settings?mode=premium">開始する</Link>
                  ) : (
                    "開始する"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* チケット購入 */}
          {status.ticketCount === 0 && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <Link href="/points/purchase">チケットを購入する</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* マッチングの説明 */}
      <Card>
        <CardHeader>
          <CardTitle>マッチングの仕組み</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="text-4xl mb-2">📝</div>
              <h3 className="font-medium">1. 価値観を登録</h3>
              <p className="text-sm text-muted-foreground">
                好きなこと、大切にしていることを登録します
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-medium">2. AI が分析</h3>
              <p className="text-sm text-muted-foreground">
                あなたの価値観を AI が分析し、相性を計算します
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-2">🤝</div>
              <h3 className="font-medium">3. 出会い</h3>
              <p className="text-sm text-muted-foreground">
                価値観が合う人と出会い、つながりを作れます
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成功事例 */}
      <Card>
        <CardHeader>
          <CardTitle>成功事例</CardTitle>
          <CardDescription>
            マッチングで素敵な出会いを見つけた方々
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm italic">
                  「同じ価値観を持つ人と出会えて、今では一緒にプロジェクトを進めています！」
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — Aさん（仕事目的でマッチング）
                </p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <p className="text-sm italic">
                  「趣味が同じ友達ができました。毎週一緒にゲームしています！」
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  — Bさん（遊び目的でマッチング）
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

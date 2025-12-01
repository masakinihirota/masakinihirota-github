/**
 * MatchingResults コンポーネント
 *
 * マッチング結果一覧を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - マッチング結果のリストを表示
 * - 各結果の相性スコアを表示
 * - いいね/スキップのアクションボタン
 * - 空状態のメッセージ表示
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type MatchingResult = {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  compatibilityScore: number;
  commonPoints: string[];
  matchedAt: string;
};

type MatchingResultsProps = {
  results: MatchingResult[];
};

export const MatchingResults = ({ results }: MatchingResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">マッチング結果</h1>
          <p className="text-muted-foreground mt-1">
            価値観で選ばれた候補者一覧
          </p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              マッチング結果がありません
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              マッチングを実行して、あなたに合った人を見つけましょう
            </p>
            <Button asChild className="mt-4">
              <Link href="/matching">マッチングを開始する</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ヘッダーエリア */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">マッチング結果</h1>
          <p className="text-muted-foreground mt-1">
            本日のマッチング結果: {results.length}件
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/matching">新しいマッチング</Link>
        </Button>
      </div>

      {/* 結果リスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={result.candidateAvatar} alt={result.candidateName} />
                  <AvatarFallback>{result.candidateName.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{result.candidateName}</CardTitle>
                  <Badge
                    variant={result.compatibilityScore >= 80 ? "default" : "secondary"}
                    className="mt-1"
                  >
                    相性 {result.compatibilityScore}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* 共通点 */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">共通点:</p>
                <div className="flex flex-wrap gap-1">
                  {result.commonPoints.map((point, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {point}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Button className="flex-1" variant="default">
                  いいね 💖
                </Button>
                <Button className="flex-1" variant="outline">
                  スキップ
                </Button>
              </div>

              {/* 詳細リンク */}
              <div className="mt-3 text-center">
                <Link
                  href={`/matching/results/${result.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  詳細を見る →
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

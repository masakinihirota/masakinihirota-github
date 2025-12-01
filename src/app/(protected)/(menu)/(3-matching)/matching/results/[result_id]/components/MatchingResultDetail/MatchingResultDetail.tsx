/**
 * MatchingResultDetail コンポーネント
 *
 * マッチング結果詳細（相性分析）を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - 候補者の基本情報表示
 * - 総合相性スコア表示
 * - 相性分析チャート（カテゴリ別スコア）
 * - AIコメント
 * - 共通点リスト
 * - 話題の提案
 * - アクションボタン
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

export type AnalysisCategory = {
  name: string;
  score: number;
};

export type MatchingResultDetailData = {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  candidateBio: string;
  compatibilityScore: number;
  analysisCategories: AnalysisCategory[];
  commonPoints: string[];
  aiComment: string;
  suggestedTopics: string[];
  matchedAt: string;
};

type MatchingResultDetailProps = {
  result: MatchingResultDetailData;
};

export const MatchingResultDetail = ({ result }: MatchingResultDetailProps) => {
  return (
    <div className="space-y-8">
      {/* ナビゲーション */}
      <div>
        <Link
          href="/matching/results"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← 結果一覧に戻る
        </Link>
      </div>

      {/* ヘッダー（候補者情報 + スコア） */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={result.candidateAvatar} alt={result.candidateName} />
              <AvatarFallback className="text-2xl">{result.candidateName.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{result.candidateName}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {result.candidateBio}
              </CardDescription>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{result.compatibilityScore}%</div>
              <div className="text-sm text-muted-foreground">総合相性スコア</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 相性分析 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 相性分析</CardTitle>
            <CardDescription>カテゴリ別の相性スコア</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.analysisCategories.map((category) => (
              <div key={category.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="font-medium">{category.score}%</span>
                </div>
                <Progress value={category.score} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AIコメント */}
        <Card>
          <CardHeader>
            <CardTitle>🤖 AIからのコメント</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {result.aiComment}
            </p>
          </CardContent>
        </Card>

        {/* 共通点 */}
        <Card>
          <CardHeader>
            <CardTitle>✨ 共通点</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.commonPoints.map((point, index) => (
                <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                  {point}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 話題の提案 */}
        <Card>
          <CardHeader>
            <CardTitle>💬 おすすめの話題</CardTitle>
            <CardDescription>まずはこんな話題から始めてみましょう</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestedTopics.map((topic, index) => (
                <li key={index} className="flex items-center gap-2">
                  <span className="text-primary">→</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* アクションボタン */}
      <Card>
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="min-w-[200px]">
              いいねを送る 💖
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              ブロック
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            いいねを送ると、相手に通知が届きます
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

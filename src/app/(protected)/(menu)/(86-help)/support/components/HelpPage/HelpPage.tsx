"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  HelpCircle,
  MessageSquare,
  AlertTriangle,
  BookOpen,
  Users,
  Wallet,
  Settings,
} from "lucide-react";

// ヘルプカテゴリ
const helpCategories = [
  {
    id: "account",
    title: "アカウント・ログイン",
    description: "ログインや登録に関する問題",
    icon: Users,
    articleCount: 15,
  },
  {
    id: "works",
    title: "作品登録・編集",
    description: "作品の投稿や編集について",
    icon: BookOpen,
    articleCount: 12,
  },
  {
    id: "community",
    title: "コミュニティ・国・組織",
    description: "組織への参加や設定について",
    icon: Users,
    articleCount: 8,
  },
  {
    id: "points",
    title: "ポイント・ランク",
    description: "ポイントシステムについて",
    icon: Wallet,
    articleCount: 6,
  },
  {
    id: "settings",
    title: "設定",
    description: "各種設定の方法",
    icon: Settings,
    articleCount: 10,
  },
  {
    id: "other",
    title: "その他",
    description: "その他のお問い合わせ",
    icon: HelpCircle,
    articleCount: 5,
  },
];

// よくある質問のサンプル
const popularQuestions = [
  {
    id: "1",
    question: "パスワードを忘れてしまいました",
    views: 1523,
  },
  {
    id: "2",
    question: "作品の公開範囲を変更したい",
    views: 982,
  },
  {
    id: "3",
    question: "組織から脱退する方法",
    views: 756,
  },
];

export function HelpPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">ヘルプセンター</h1>
        <p className="text-muted-foreground">
          どのようなことでお困りですか？
        </p>
      </div>

      {/* 検索エリア */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="キーワードを入力して検索..."
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* よくある質問 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            よくある質問
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {popularQuestions.map((q) => (
              <li key={q.id}>
                <a
                  href={`/faq#${q.id}`}
                  className="flex items-center justify-between py-3 hover:bg-muted/50 px-2 rounded"
                >
                  <span>{q.question}</span>
                  <Badge variant="secondary">{q.views} 閲覧</Badge>
                </a>
              </li>
            ))}
          </ul>
          <Button variant="link" className="mt-2">
            すべての質問を見る →
          </Button>
        </CardContent>
      </Card>

      {/* カテゴリ一覧 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">カテゴリから探す</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card
                key={category.id}
                className="cursor-pointer hover:border-primary transition-colors"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {category.description}
                  </p>
                  <Badge variant="outline">{category.articleCount} 記事</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* お問い合わせセクション */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            解決しない場合
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            お探しの情報が見つからない場合は、お気軽にお問い合わせください。
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>お問い合わせフォーム</Button>
            <Button variant="outline" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              違反を通報
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

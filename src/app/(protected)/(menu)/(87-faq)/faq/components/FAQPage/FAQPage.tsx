"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Users,
  BookOpen,
  Wallet,
  Settings,
  HelpCircle,
} from "lucide-react";

// カテゴリ
const categories = [
  { id: "all", label: "すべて", icon: HelpCircle },
  { id: "account", label: "アカウント・ログイン", icon: Users },
  { id: "works", label: "作品登録・編集", icon: BookOpen },
  { id: "community", label: "コミュニティ・国・組織", icon: Users },
  { id: "points", label: "ポイント・ランク", icon: Wallet },
  { id: "settings", label: "その他", icon: Settings },
];

// FAQデータ
const faqData = [
  {
    id: "1",
    category: "account",
    question: "パスワードを忘れてしまいました",
    answer:
      "ログイン画面の「パスワードをお忘れの方」リンクからパスワードをリセットできます。登録メールアドレス宛にリセットリンクが送信されます。",
    popular: true,
  },
  {
    id: "2",
    category: "account",
    question: "メールアドレスを変更したい",
    answer:
      "設定 > アカウント設定から、メールアドレスの変更が可能です。変更後は確認メールが送信されますので、承認をお願いします。",
    popular: false,
  },
  {
    id: "3",
    category: "works",
    question: "作品の公開範囲を変更したい",
    answer:
      "作品詳細ページの編集ボタンから、公開範囲（公開/限定公開/非公開）を変更できます。変更は即座に反映されます。",
    popular: true,
  },
  {
    id: "4",
    category: "works",
    question: "作品を削除したい",
    answer:
      "作品詳細ページの「...」メニューから「削除」を選択してください。削除後は復元できませんのでご注意ください。",
    popular: false,
  },
  {
    id: "5",
    category: "community",
    question: "組織から脱退する方法",
    answer:
      "組織ページ > 設定 > メンバー管理から「脱退」を選択してください。管理者の場合は、先に管理者権限を他のメンバーに移譲する必要があります。",
    popular: true,
  },
  {
    id: "6",
    category: "points",
    question: "ポイントはどのように獲得できますか？",
    answer:
      "作品の投稿、コメント、いいね、マッチング成立など、様々なアクションでポイントを獲得できます。詳しくはポイントガイドをご参照ください。",
    popular: false,
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50"
        aria-expanded={isOpen}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-muted-foreground">{answer}</p>
          <div className="flex items-center gap-4 pt-2 border-t">
            <span className="text-sm text-muted-foreground">
              この回答は役に立ちましたか？
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <ThumbsUp className="h-4 w-4" />
                はい
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <ThumbsDown className="h-4 w-4" />
                いいえ
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQ = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularFAQ = faqData.filter((item) => item.popular);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">よくある質問 (FAQ)</h1>
        <p className="text-muted-foreground">
          お探しの回答が見つからない場合は、お問い合わせください。
        </p>
      </div>

      {/* 検索バー */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="キーワードで検索..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* 人気の質問 */}
      {searchQuery === "" && selectedCategory === "all" && (
        <Card>
          <CardHeader>
            <CardTitle>人気の質問</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {popularFAQ.map((faq) => (
              <div key={faq.id}>
                <FAQItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openItems.includes(faq.id)}
                  onToggle={() => toggleItem(faq.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* カテゴリ選択 */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* FAQ一覧 */}
      <div className="space-y-3">
        {filteredFAQ.length > 0 ? (
          filteredFAQ.map((faq) => (
            <FAQItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItems.includes(faq.id)}
              onToggle={() => toggleItem(faq.id)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                該当する質問が見つかりませんでした。
              </p>
              <Button variant="link" className="mt-2">
                お問い合わせフォームへ
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* お問い合わせへのリンク */}
      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center space-y-4">
          <p className="text-muted-foreground">
            解決しない場合は、お問い合わせください。
          </p>
          <Button>お問い合わせフォームへ</Button>
        </CardContent>
      </Card>
    </div>
  );
}

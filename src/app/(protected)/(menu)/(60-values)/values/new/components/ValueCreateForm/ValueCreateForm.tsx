/**
 * ValueCreateForm コンポーネント
 *
 * 新しい価値観を作成するフォームコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - 価値観タイトル（質問文）の入力
 * - 補足説明の入力
 * - カテゴリの選択
 * - 回答形式の選択
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

const CATEGORIES = [
  { value: "life", label: "人生" },
  { value: "work", label: "仕事" },
  { value: "relationship", label: "人間関係" },
  { value: "love", label: "恋愛" },
  { value: "health", label: "健康" },
  { value: "money", label: "お金" },
  { value: "other", label: "その他" },
];

const ANSWER_TYPES = [
  { value: "text", label: "自由記述" },
  { value: "choice", label: "選択式" },
  { value: "scale", label: "スケール（1-5段階）" },
];

export const ValueCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: API呼び出しを実装
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push("/values");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">価値観を作成</h1>
        <Button variant="outline" asChild>
          <Link href="/values">キャンセル</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>新しい価値観</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">質問（タイトル）*</Label>
              <Input
                id="title"
                name="title"
                placeholder="あなたにとって幸せとは？"
                required
              />
              <p className="text-sm text-muted-foreground">
                シンプルで本質的な質問を心がけましょう
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">補足説明</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="質問の意図や背景を説明してください"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ*</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリを選択" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="answerType">回答形式*</Label>
              <Select name="answerType" defaultValue="text">
                <SelectTrigger>
                  <SelectValue placeholder="回答形式を選択" />
                </SelectTrigger>
                <SelectContent>
                  {ANSWER_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" aria-disabled={isSubmitting}>
                {isSubmitting ? "作成中..." : "作成する"}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href="/values">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

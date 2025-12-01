/**
 * WorkCreateForm コンポーネント
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
  { value: "manga", label: "漫画" },
  { value: "novel", label: "小説" },
  { value: "movie", label: "映画" },
  { value: "anime", label: "アニメ" },
  { value: "game", label: "ゲーム" },
  { value: "music", label: "音楽" },
  { value: "other", label: "その他" },
];

export const WorkCreateForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push("/works");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">作品を登録</h1>
        <Button variant="outline" asChild>
          <Link href="/works">キャンセル</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>作品情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル*</Label>
              <Input
                id="title"
                name="title"
                placeholder="作品のタイトル"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                name="author"
                placeholder="作者名"
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
              <Label htmlFor="year">発表年</Label>
              <Input
                id="year"
                name="year"
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="作品の説明"
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "登録中..." : "登録する"}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href="/works">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

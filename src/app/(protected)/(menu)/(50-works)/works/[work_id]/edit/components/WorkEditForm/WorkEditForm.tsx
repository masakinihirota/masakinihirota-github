/**
 * WorkEditForm コンポーネント
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

export type WorkEditData = {
  id: string;
  title: string;
  author?: string;
  category: string;
  year?: string;
  description?: string;
};

type WorkEditFormProps = {
  work: WorkEditData;
};

export const WorkEditForm = ({ work }: WorkEditFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push(`/works/${work.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">作品を編集</h1>
        <Button variant="outline" asChild>
          <Link href={`/works/${work.id}`}>キャンセル</Link>
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
                defaultValue={work.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">作者</Label>
              <Input
                id="author"
                name="author"
                defaultValue={work.author}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ*</Label>
              <Select name="category" defaultValue={work.category}>
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
                defaultValue={work.year}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">説明</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={work.description}
                rows={3}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" aria-disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存する"}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href={`/works/${work.id}`}>キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

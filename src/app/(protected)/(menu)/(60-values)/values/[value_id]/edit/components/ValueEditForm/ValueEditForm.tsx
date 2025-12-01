/**
 * ValueEditForm コンポーネント
 *
 * 価値観を編集するフォームコンポーネント
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

export type ValueEditData = {
  id: string;
  title: string;
  category: string;
  description?: string;
};

type ValueEditFormProps = {
  value: ValueEditData;
};

export const ValueEditForm = ({ value }: ValueEditFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: API呼び出しを実装
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsSubmitting(false);
    router.push(`/values/${value.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">価値観を編集</h1>
        <Button variant="outline" asChild>
          <Link href={`/values/${value.id}`}>キャンセル</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>価値観情報</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">質問（タイトル）*</Label>
              <Input
                id="title"
                name="title"
                defaultValue={value.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">補足説明</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={value.description}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">カテゴリ*</Label>
              <Select name="category" defaultValue={value.category}>
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

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "保存中..." : "保存する"}
              </Button>
              <Button variant="outline" type="button" asChild>
                <Link href={`/values/${value.id}`}>キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

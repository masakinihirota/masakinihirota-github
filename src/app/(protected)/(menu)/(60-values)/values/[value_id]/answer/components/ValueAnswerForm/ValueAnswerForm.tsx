/**
 * ValueAnswerForm コンポーネント
 *
 * 価値観に回答するフォームコンポーネント
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export type ValueForAnswer = {
  id: string;
  title: string;
  category: string;
  description?: string;
  myAnswer?: string;
};

type ValueAnswerFormProps = {
  value: ValueForAnswer;
};

export const ValueAnswerForm = ({ value }: ValueAnswerFormProps) => {
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
        <h1 className="text-2xl font-semibold">価値観に回答</h1>
        <Button variant="outline" asChild>
          <Link href={`/values/${value.id}`}>キャンセル</Link>
        </Button>
      </div>

      {/* 質問カード */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{value.category}</Badge>
          </div>
          <CardTitle className="text-xl">{value.title}</CardTitle>
        </CardHeader>
        {value.description && (
          <CardContent>
            <p className="text-muted-foreground">{value.description}</p>
          </CardContent>
        )}
      </Card>

      {/* 回答フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>あなたの回答</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="answer">回答を入力してください</Label>
              <Textarea
                id="answer"
                name="answer"
                defaultValue={value.myAnswer}
                placeholder="あなたの考えを自由に書いてください..."
                rows={6}
                required
              />
              <p className="text-sm text-muted-foreground">
                素直な気持ちで回答してください。正解・不正解はありません。
              </p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "送信中..." : value.myAnswer ? "回答を更新" : "回答する"}
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

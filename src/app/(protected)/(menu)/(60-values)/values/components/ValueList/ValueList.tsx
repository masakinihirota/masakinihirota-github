/**
 * ValueList コンポーネント
 *
 * 価値観一覧を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - 価値観一覧の表示
 * - タイトル、カテゴリ、作成者、統計情報の表示
 * - 詳細・回答アクションの提供
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Value = {
  id: string;
  title: string;
  category: string;
  description?: string;
  creator?: string;
  answerCount?: number;
  createdAt?: string;
};

type ValueListProps = {
  values: Value[];
};

export const ValueList = ({ values }: ValueListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">価値観一覧</h1>
        <Button asChild>
          <Link href="/values/new">新規作成</Link>
        </Button>
      </div>

      {values.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>価値観が見つかりません</p>
          <p className="text-sm mt-2">新しい価値観を作成してください</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <Card key={value.id} role="listitem">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {value.title}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {value.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {value.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {value.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {value.creator && <span>作成者: {value.creator}</span>}
                  {value.answerCount !== undefined && (
                    <span>{value.answerCount}件の回答</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/values/${value.id}`}>詳細</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/values/${value.id}/answer`}>回答する</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

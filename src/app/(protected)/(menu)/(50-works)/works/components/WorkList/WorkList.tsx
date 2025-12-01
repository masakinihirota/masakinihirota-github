/**
 * WorkList コンポーネント
 *
 * 作品一覧を表示するコンポーネント
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type Work = {
  id: string;
  title: string;
  author?: string;
  category: string;
  imageUrl?: string;
  year?: string;
  rating?: number;
};

type WorkListProps = {
  works: Work[];
};

export const WorkList = ({ works }: WorkListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">作品一覧</h1>
        <Button asChild>
          <Link href="/works/new">作品を登録</Link>
        </Button>
      </div>

      {works.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>作品が見つかりません</p>
          <p className="text-sm mt-2">新しい作品を登録してください</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <Card key={work.id} role="listitem">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {work.title}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {work.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {work.author && <span>{work.author}</span>}
                  {work.year && <span>{work.year}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/works/${work.id}`}>詳細</Link>
                  </Button>
                  <Button size="sm" asChild className="flex-1">
                    <Link href={`/works/${work.id}/review`}>評価する</Link>
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

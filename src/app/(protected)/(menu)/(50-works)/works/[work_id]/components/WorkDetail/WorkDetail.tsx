/**
 * WorkDetail コンポーネント
 *
 * 作品の詳細を表示するコンポーネント
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type WorkComment = {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
};

export type WorkDetailData = {
  id: string;
  title: string;
  author?: string;
  category: string;
  description?: string;
  year?: string;
  externalLinks?: { label: string; url: string }[];
  myRating?: {
    tier: string;
    status: string;
  };
  comments: WorkComment[];
};

type WorkDetailProps = {
  work: WorkDetailData;
};

export const WorkDetail = ({ work }: WorkDetailProps) => {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{work.category}</Badge>
            {work.year && <span className="text-sm text-muted-foreground">{work.year}</span>}
          </div>
          <h1 className="text-2xl font-semibold">{work.title}</h1>
          {work.author && (
            <p className="text-muted-foreground">作者: {work.author}</p>
          )}
          {work.description && (
            <p className="text-muted-foreground">{work.description}</p>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link href={`/works/${work.id}/edit`}>編集</Link>
        </Button>
      </div>

      {/* あなたの評価 */}
      <Card>
        <CardHeader>
          <CardTitle>あなたの評価</CardTitle>
        </CardHeader>
        <CardContent>
          {work.myRating ? (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Badge>{work.myRating.tier}</Badge>
                <Badge variant="outline">{work.myRating.status}</Badge>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/works/${work.id}/review`}>評価を編集</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">まだ評価していません</p>
              <Button asChild>
                <Link href={`/works/${work.id}/review`}>評価する</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* コメント */}
      <Card>
        <CardHeader>
          <CardTitle>コメント</CardTitle>
        </CardHeader>
        <CardContent>
          {work.comments.length === 0 ? (
            <p className="text-muted-foreground">まだコメントがありません</p>
          ) : (
            <div className="space-y-4">
              {work.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-4 border rounded-lg"
                  role="listitem"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{comment.userName}</span>
                    <span className="text-sm text-muted-foreground">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ナビゲーション */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/works">一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
};

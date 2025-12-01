/**
 * ValueDetail コンポーネント
 *
 * 価値観の詳細を表示するコンポーネント
 *
 * @description
 * UI設計書に基づく機能:
 * - 価値観タイトル・カテゴリ・作成者の表示
 * - 自分の回答状態の表示
 * - みんなの回答一覧
 * - 関連する価値観
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

export type ValueAnswer = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type ValueDetailData = {
  id: string;
  title: string;
  category: string;
  description?: string;
  creator: string;
  creatorAvatar?: string;
  createdAt: string;
  answerCount: number;
  myAnswer?: string;
  answers: ValueAnswer[];
};

type ValueDetailProps = {
  value: ValueDetailData;
};

export const ValueDetail = ({ value }: ValueDetailProps) => {
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{value.category}</Badge>
            <span className="text-sm text-muted-foreground">
              {value.answerCount}件の回答
            </span>
          </div>
          <h1 className="text-2xl font-semibold">{value.title}</h1>
          {value.description && (
            <p className="text-muted-foreground">{value.description}</p>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>作成者: {value.creator}</span>
            <span>・</span>
            <span>{value.createdAt}</span>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/values/${value.id}/edit`}>編集</Link>
        </Button>
      </div>

      {/* あなたの回答 */}
      <Card>
        <CardHeader>
          <CardTitle>あなたの回答</CardTitle>
        </CardHeader>
        <CardContent>
          {value.myAnswer ? (
            <div className="space-y-4">
              <p>{value.myAnswer}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/values/${value.id}/answer`}>回答を編集</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">まだ回答していません</p>
              <Button asChild>
                <Link href={`/values/${value.id}/answer`}>回答する</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* みんなの回答 */}
      <Card>
        <CardHeader>
          <CardTitle>みんなの回答</CardTitle>
        </CardHeader>
        <CardContent>
          {value.answers.length === 0 ? (
            <p className="text-muted-foreground">まだ回答がありません</p>
          ) : (
            <div className="space-y-4">
              {value.answers.map((answer) => (
                <div
                  key={answer.id}
                  className="flex gap-4 p-4 border rounded-lg"
                  role="listitem"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={answer.userAvatar} alt={answer.userName} />
                    <AvatarFallback>
                      {answer.userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{answer.userName}</span>
                      <span className="text-sm text-muted-foreground">
                        {answer.createdAt}
                      </span>
                    </div>
                    <p className="mt-2">{answer.content}</p>
                    <div className="mt-2">
                      <Button variant="ghost" size="sm">
                        ♡ {answer.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ナビゲーション */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/values">一覧に戻る</Link>
        </Button>
      </div>
    </div>
  );
};

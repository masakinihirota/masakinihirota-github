/**
 * RootAccountDashboard コンポーネント
 *
 * ルートアカウントの詳細情報を表示するダッシュボード
 */
"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface RootAccount {
  id: string;
  displayName: string;
  location: string;
  language: string;
  generation: string;
  points: number;
}

interface Profile {
  id: string;
  name: string;
  purpose: string;
  avatarUrl?: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface RootAccountDashboardProps {
  rootAccount: RootAccount;
  profiles: Profile[];
  achievements: Achievement[];
}

export function RootAccountDashboard({
  rootAccount,
  profiles,
  achievements,
}: RootAccountDashboardProps) {
  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* ルートアカウント情報カード */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/default-avatar.png" alt={rootAccount.displayName} />
              <AvatarFallback>
                {rootAccount.displayName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{rootAccount.displayName}</h1>
              <p className="text-muted-foreground text-sm">
                ルートアカウント
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">居住地:</span>{" "}
              <span>{rootAccount.location}</span>
            </div>
            <div>
              <span className="text-muted-foreground">母語:</span>{" "}
              <span>{rootAccount.language}</span>
            </div>
            <div>
              <span className="text-muted-foreground">生誕世代:</span>{" "}
              <span>{rootAccount.generation}</span>
            </div>
          </div>

          {/* ポイント残高 */}
          <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:from-yellow-900/20 dark:to-orange-900/20">
            <p className="text-muted-foreground text-sm">ポイント残高</p>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatPoints(rootAccount.points)}{" "}
              <span className="text-lg">pt</span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/root-accounts/${rootAccount.id}/history`}>
                ポイント履歴を見る
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/root-accounts/${rootAccount.id}/settings`}>
                設定
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ユーザープロフィール一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>📋 ユーザープロフィール一覧</CardTitle>
          <CardDescription>
            このルートアカウントに紐づくプロフィール
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/profiles/new">+ 新しいプロフィールを作成</Link>
          </Button>

          {profiles.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center">
              プロフィールがまだありません
            </p>
          ) : (
            <div className="space-y-3">
              {profiles.map((profile) => (
                <Card key={profile.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={profile.avatarUrl}
                          alt={profile.name}
                        />
                        <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-muted-foreground text-sm">
                          目的: {profile.purpose}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/profiles/${profile.id}`}>詳細を見る</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/profiles/${profile.id}/edit`}>編集</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* アチーブメント */}
      <Card>
        <CardHeader>
          <CardTitle>🏆 アチーブメント</CardTitle>
          <CardDescription>獲得した実績</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 rounded-lg p-3 ${
                achievement.unlocked
                  ? "bg-yellow-50 dark:bg-yellow-900/20"
                  : "bg-gray-50 opacity-60 dark:bg-gray-800/50"
              }`}
            >
              <span className="text-2xl">
                {achievement.unlocked ? "🏆" : "🔒"}
              </span>
              <div>
                <p
                  className={`font-medium ${
                    !achievement.unlocked && "text-muted-foreground"
                  }`}
                >
                  {achievement.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}

          <Button variant="link" className="w-full" asChild>
            <Link href={`/root-accounts/${rootAccount.id}/achievements`}>
              すべて見る →
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

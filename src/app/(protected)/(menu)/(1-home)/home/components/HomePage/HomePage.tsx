"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserPlus,
  BookOpen,
  Users,
  Bell,
  Heart,
  ArrowRight,
  Star,
} from "lucide-react";

// クイックアクション
const quickActions = [
  {
    id: "matching",
    label: "マッチング開始",
    icon: Users,
    href: "/matching",
    description: "価値観が合う人を探す",
  },
  {
    id: "work",
    label: "作品登録",
    icon: BookOpen,
    href: "/works/new",
    description: "新しい作品を投稿する",
  },
  {
    id: "profile",
    label: "プロフィール作成",
    icon: UserPlus,
    href: "/profiles/new",
    description: "プロフィールを充実させる",
  },
];

// 最近のアクティビティ
const recentActivities = [
  {
    id: "1",
    type: "matching",
    message: "新しいマッチングが見つかりました",
    count: 3,
    time: "1時間前",
  },
  {
    id: "2",
    type: "follow",
    message: "佐藤創作さんがあなたをフォローしました",
    time: "2時間前",
  },
  {
    id: "3",
    type: "applause",
    message: "あなたの作品に拍手が送られました",
    count: 5,
    time: "3時間前",
  },
  {
    id: "4",
    type: "invite",
    message: '組織「クリエイターズギルド」に招待されました',
    time: "昨日",
  },
];

// おすすめユーザー
const recommendedUsers = [
  {
    id: "1",
    name: "鈴木芸術",
    avatar: "",
    matchRate: 85,
    commonValues: ["創造性", "自由"],
  },
  {
    id: "2",
    name: "田中文化",
    avatar: "",
    matchRate: 78,
    commonValues: ["美意識", "協調性"],
  },
  {
    id: "3",
    name: "高橋哲学",
    avatar: "",
    matchRate: 72,
    commonValues: ["探究心", "誠実"],
  },
];

export function HomePage() {
  const userName = "ゲスト"; // 実際にはユーザー情報から取得

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ウェルカムメッセージ */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="py-6">
          <h1 className="text-2xl font-bold">
            ようこそ、{userName}さん
          </h1>
          <p className="text-muted-foreground mt-2">
            VNS masakinihirota で価値観を共有しましょう！
          </p>
        </CardContent>
      </Card>

      {/* クイックアクション */}
      <Card>
        <CardHeader>
          <CardTitle>クイックアクション</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center gap-2"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <span className="font-medium">{action.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 最近の活動 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            最近の活動
          </CardTitle>
          <Button variant="link" className="gap-1">
            すべて見る
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {recentActivities.map((activity) => (
              <li
                key={activity.id}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 px-2 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>
                    {activity.message}
                    {activity.count && (
                      <Badge variant="secondary" className="ml-2">
                        {activity.count}件
                      </Badge>
                    )}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.time}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* おすすめ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            おすすめのユーザー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 text-yellow-500" />
                        一致度: {user.matchRate}%
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.commonValues.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    プロフィールを見る
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

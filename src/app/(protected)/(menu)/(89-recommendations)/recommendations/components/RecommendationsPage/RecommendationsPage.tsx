"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  BookOpen,
  Users,
  Star,
} from "lucide-react";

// 特集セクションデータ
const featuredSections = [
  {
    id: "sf-lovers",
    title: "SF好きのあなたへ",
    description: "価値観が似たSF作家の作品をピックアップ",
    icon: BookOpen,
    items: [
      {
        id: "1",
        type: "work",
        title: "星の彼方へ",
        author: "宇宙太郎",
        reason: "あなたの「探究心」という価値観にマッチ",
        image: "",
      },
      {
        id: "2",
        type: "work",
        title: "機械仕掛けの夢",
        author: "電脳花子",
        reason: "AI・テクノロジーに興味があるあなたへ",
        image: "",
      },
    ],
  },
  {
    id: "trending-orgs",
    title: "話題の組織",
    description: "今週注目を集めている組織をご紹介",
    icon: Users,
    items: [
      {
        id: "3",
        type: "organization",
        title: "クリエイターズギルド",
        author: "",
        reason: "あなたの活動エリアで人気上昇中",
        memberCount: 234,
        image: "",
      },
      {
        id: "4",
        type: "organization",
        title: "デジタルアート協会",
        author: "",
        reason: "共通の価値観を持つメンバーが多数",
        memberCount: 156,
        image: "",
      },
    ],
  },
];

// おすすめユーザー
const recommendedUsers = [
  {
    id: "1",
    name: "佐藤創作",
    avatar: "",
    bio: "小説家 / イラストレーター",
    matchRate: 85,
    commonValues: ["創造性", "自由"],
  },
  {
    id: "2",
    name: "鈴木芸術",
    avatar: "",
    bio: "映像クリエイター",
    matchRate: 78,
    commonValues: ["美意識", "革新"],
  },
  {
    id: "3",
    name: "田中文化",
    avatar: "",
    bio: "音楽プロデューサー",
    matchRate: 72,
    commonValues: ["協調性", "表現"],
  },
];

export function RecommendationsPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">あなたへのおすすめ</h1>
          </div>
          <p className="text-muted-foreground">
            あなたの価値観や活動履歴に基づいた提案です
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          更新する
        </Button>
      </div>

      {/* おすすめユーザー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            おすすめのユーザー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {recommendedUsers.map((user) => (
              <Card key={user.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {user.bio}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {user.matchRate}% マッチ
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.commonValues.map((value) => (
                      <Badge key={value} variant="secondary" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      プロフィールを見る
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 特集セクション */}
      {featuredSections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {section.items.map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          {item.author && (
                            <p className="text-sm text-muted-foreground">
                              {item.author}
                            </p>
                          )}
                          {"memberCount" in item && (
                            <p className="text-sm text-muted-foreground">
                              {item.memberCount} メンバー
                            </p>
                          )}
                        </div>
                        <Badge variant="outline">{item.type === "work" ? "作品" : "組織"}</Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-primary">
                        <Sparkles className="h-3 w-3" />
                        {item.reason}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            興味あり
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-1">
                            <ThumbsDown className="h-4 w-4" />
                            興味なし
                          </Button>
                        </div>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* フィードバック */}
      <Card className="bg-muted/50">
        <CardContent className="py-6 text-center space-y-4">
          <p className="text-muted-foreground">
            おすすめの精度を向上させるために、フィードバックをお願いします。
          </p>
          <Button variant="outline">設定でおすすめをカスタマイズ</Button>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Undo2,
  Settings2,
  User,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockPenalties = [
  {
    id: "1",
    targetUser: "violator1@example.com",
    targetName: "違反ユーザーA",
    reason: "誹謗中傷の繰り返し",
    type: "ban",
    adminUser: "admin@example.com",
    adminName: "管理者A",
    createdAt: "2024-12-01 14:30",
    expiresAt: null,
  },
  {
    id: "2",
    targetUser: "violator2@example.com",
    targetName: "違反ユーザーB",
    reason: "スパム投稿",
    type: "suspension",
    adminUser: "admin@example.com",
    adminName: "管理者A",
    createdAt: "2024-11-28 10:00",
    expiresAt: "2024-12-05 10:00",
  },
  {
    id: "3",
    targetUser: "violator3@example.com",
    targetName: "違反ユーザーC",
    reason: "NGワード使用",
    type: "warning",
    adminUser: "moderator@example.com",
    adminName: "モデレーターB",
    createdAt: "2024-11-25 16:45",
    expiresAt: null,
  },
];

const mockRules = [
  {
    id: "1",
    name: "通報5回で自動凍結",
    description: "24時間以内に5回以上の通報を受けたアカウントを自動凍結",
    enabled: true,
  },
  {
    id: "2",
    name: "NGワード自動警告",
    description: "NGワードを含む投稿に対して自動で警告メッセージを送信",
    enabled: true,
  },
  {
    id: "3",
    name: "スパム検知",
    description: "1分間に10件以上の投稿を行ったアカウントを一時停止",
    enabled: false,
  },
];

export function AdminPenaltiesPage() {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ban":
        return <Badge variant="destructive">永久BAN</Badge>;
      case "suspension":
        return <Badge className="bg-amber-500">一時停止</Badge>;
      case "warning":
        return <Badge variant="secondary">警告</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* ヘッダー */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/admin" className="hover:text-foreground">
            管理者ホーム
          </Link>
          <span>/</span>
          <span>ペナルティ管理</span>
        </div>
        <h1 className="text-3xl font-bold">ペナルティ管理</h1>
        <p className="text-muted-foreground mt-1">
          違反ユーザーへの処罰履歴と自動ペナルティルールの設定
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ペナルティ履歴 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              ペナルティ履歴
            </CardTitle>
            <CardDescription>
              いつ、誰が、誰に、どんな理由で処罰したか
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPenalties.map((penalty) => (
                <div
                  key={penalty.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(penalty.type)}
                      <span className="font-medium">{penalty.targetName}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Undo2 className="h-4 w-4 mr-1" />
                      解除
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <AlertTriangle className="h-3 w-3 inline mr-1" />
                    理由: {penalty.reason}
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      対象: {penalty.targetUser}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      実行者: {penalty.adminName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {penalty.createdAt}
                    </span>
                    {penalty.expiresAt && (
                      <span className="text-amber-600">
                        期限: {penalty.expiresAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ルール設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              自動ルール設定
            </CardTitle>
            <CardDescription>
              自動ペナルティの条件設定
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
              >
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${
                    rule.enabled ? "bg-green-500" : "bg-muted-foreground"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{rule.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              ルールを編集
            </Button>
          </CardContent>
        </Card>

        {/* NGワード設定 */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>NGワード設定</CardTitle>
            <CardDescription>
              自動検出・警告対象のワードを管理
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Input placeholder="新しいNGワードを追加..." className="flex-1" />
              <Button>追加</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["罵倒語A", "誹謗表現B", "スパムワードC", "不適切表現D"].map(
                (word) => (
                  <Badge key={word} variant="outline" className="px-3 py-1">
                    {word}
                    <button className="ml-2 text-muted-foreground hover:text-foreground">
                      ×
                    </button>
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

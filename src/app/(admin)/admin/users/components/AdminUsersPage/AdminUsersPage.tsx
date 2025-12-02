"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  User,
  Ban,
  KeyRound,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockUsers = [
  {
    id: "1",
    email: "user1@example.com",
    displayName: "山田太郎",
    status: "active",
    registeredAt: "2024-01-15",
    lastLogin: "2024-12-01",
    ip: "192.168.1.1",
  },
  {
    id: "2",
    email: "user2@example.com",
    displayName: "鈴木花子",
    status: "active",
    registeredAt: "2024-03-20",
    lastLogin: "2024-11-30",
    ip: "192.168.1.2",
  },
  {
    id: "3",
    email: "banned@example.com",
    displayName: "違反ユーザー",
    status: "banned",
    registeredAt: "2024-02-10",
    lastLogin: "2024-10-15",
    ip: "192.168.1.3",
  },
  {
    id: "4",
    email: "frozen@example.com",
    displayName: "凍結ユーザー",
    status: "frozen",
    registeredAt: "2024-05-05",
    lastLogin: "2024-09-20",
    ip: "192.168.1.4",
  },
];

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.ip.includes(searchQuery)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">正常</Badge>;
      case "frozen":
        return <Badge variant="secondary">凍結</Badge>;
      case "banned":
        return <Badge variant="destructive">BAN</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/admin" className="hover:text-foreground">
              管理者ホーム
            </Link>
            <span>/</span>
            <span>ユーザー管理</span>
          </div>
          <h1 className="text-3xl font-bold">ユーザー管理</h1>
          <p className="text-muted-foreground mt-1">
            ユーザーの検索、詳細確認、強制操作を行います
          </p>
        </div>
      </div>

      {/* 検索エリア */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ユーザー検索</CardTitle>
          <CardDescription>
            ID、メールアドレス、IPアドレスで検索
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>検索</Button>
          </div>
        </CardContent>
      </Card>

      {/* ユーザーリスト */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ユーザー一覧</CardTitle>
          <CardDescription>
            {filteredUsers.length} 件のユーザー
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.displayName}</span>
                      {getStatusBadge(user.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      登録: {user.registeredAt} · 最終ログイン: {user.lastLogin}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                  {user.status === "active" ? (
                    <Button variant="outline" size="sm" className="text-amber-600">
                      <Ban className="h-4 w-4 mr-1" />
                      凍結
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-green-600">
                      解除
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <KeyRound className="h-4 w-4 mr-1" />
                    PW リセット
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* ページネーション */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              1-{filteredUsers.length} / {mockUsers.length} 件
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
                前へ
              </Button>
              <Button variant="outline" size="sm" disabled>
                次へ
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

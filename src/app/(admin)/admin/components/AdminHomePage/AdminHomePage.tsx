"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockKPIs = [
  { label: "総ユーザー数", value: "12,345", change: "+5.2%", icon: Users },
  { label: "DAU (日次アクティブ)", value: "3,456", change: "+2.1%", icon: Activity },
  { label: "投稿数", value: "45,678", change: "+8.5%", icon: FileText },
  { label: "国数", value: "156", change: "+3", icon: TrendingUp },
];

const mockAlerts = [
  {
    id: "1",
    type: "error",
    message: "サーバーエラーが3件検出されました",
    time: "5分前",
  },
  {
    id: "2",
    type: "warning",
    message: "通報が10件以上未処理です",
    time: "15分前",
  },
  {
    id: "3",
    type: "info",
    message: "定期バックアップが完了しました",
    time: "1時間前",
  },
];

const mockRecentActivity = [
  {
    id: "1",
    action: "ユーザーをBANしました",
    admin: "管理者A",
    target: "user@example.com",
    time: "10分前",
  },
  {
    id: "2",
    action: "コンテンツを削除しました",
    admin: "モデレーターB",
    target: "投稿ID: 12345",
    time: "30分前",
  },
  {
    id: "3",
    action: "設定を変更しました",
    admin: "管理者A",
    target: "NGワードリスト",
    time: "1時間前",
  },
];

export function AdminHomePage() {
  const systemStatus = "正常";

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
          <p className="text-muted-foreground mt-1">
            システムの概要と重要な指標
          </p>
        </div>
        <Badge
          variant={systemStatus === "正常" ? "default" : "destructive"}
          className="text-sm px-3 py-1"
        >
          <CheckCircle className="w-4 h-4 mr-1" />
          システム{systemStatus}
        </Badge>
      </div>

      {/* KPIパネル */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockKPIs.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {kpi.change} 前週比
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* アラート一覧 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              アラート
            </CardTitle>
            <CardDescription>
              確認が必要な項目
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "error"
                        ? "bg-red-500"
                        : alert.type === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 最近の管理操作 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              最近のアクティビティ
            </CardTitle>
            <CardDescription>
              管理操作ログ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                      <span>{activity.admin}</span>
                      <span>·</span>
                      <span>{activity.target}</span>
                      <span>·</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* クイックナビゲーション */}
      <Card>
        <CardHeader>
          <CardTitle>管理メニュー</CardTitle>
          <CardDescription>
            各管理機能へのアクセス
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-between">
                ユーザー管理
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/content">
              <Button variant="outline" className="w-full justify-between">
                コンテンツ管理
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/system">
              <Button variant="outline" className="w-full justify-between">
                システム管理
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/penalties">
              <Button variant="outline" className="w-full justify-between">
                ペナルティ管理
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

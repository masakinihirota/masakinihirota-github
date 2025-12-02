"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Server,
  RefreshCw,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Terminal,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockLogs = [
  {
    id: "1",
    level: "info",
    message: "ユーザーログイン: user@example.com",
    timestamp: "2024-12-01 15:30:45",
  },
  {
    id: "2",
    level: "warning",
    message: "API レート制限に達しました: /api/users",
    timestamp: "2024-12-01 15:28:30",
  },
  {
    id: "3",
    level: "error",
    message: "データベース接続タイムアウト",
    timestamp: "2024-12-01 15:25:10",
  },
  {
    id: "4",
    level: "info",
    message: "バックアップ完了: backup_20241201.sql",
    timestamp: "2024-12-01 15:00:00",
  },
  {
    id: "5",
    level: "info",
    message: "キャッシュクリア完了",
    timestamp: "2024-12-01 14:45:00",
  },
];

const mockJobs = [
  {
    id: "1",
    name: "日次バックアップ",
    schedule: "毎日 03:00",
    lastRun: "2024-12-01 03:00:00",
    status: "success",
    nextRun: "2024-12-02 03:00:00",
  },
  {
    id: "2",
    name: "メール送信キュー処理",
    schedule: "5分毎",
    lastRun: "2024-12-01 15:30:00",
    status: "success",
    nextRun: "2024-12-01 15:35:00",
  },
  {
    id: "3",
    name: "統計データ集計",
    schedule: "毎時 00分",
    lastRun: "2024-12-01 15:00:00",
    status: "failed",
    nextRun: "2024-12-01 16:00:00",
  },
  {
    id: "4",
    name: "古いセッション削除",
    schedule: "毎日 04:00",
    lastRun: "2024-12-01 04:00:00",
    status: "success",
    nextRun: "2024-12-02 04:00:00",
  },
];

export function AdminSystemPage() {
  const [logFilter, setLogFilter] = useState<string>("all");

  const filteredLogs =
    logFilter === "all"
      ? mockLogs
      : mockLogs.filter((log) => log.level === logFilter);

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return <Badge variant="secondary">Info</Badge>;
      case "warning":
        return <Badge className="bg-amber-500">Warning</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
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
            <span>システム管理</span>
          </div>
          <h1 className="text-3xl font-bold">システム管理</h1>
          <p className="text-muted-foreground mt-1">
            サーバーログ、エラーログ、バッチ処理の状態を確認
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            更新
          </Button>
          <Button variant="outline" className="text-amber-600">
            <Trash2 className="h-4 w-4 mr-2" />
            キャッシュクリア
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ログビューア */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  システムログ
                </CardTitle>
                <CardDescription>
                  リアルタイムログストリーム
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={logFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLogFilter("all")}
                >
                  すべて
                </Button>
                <Button
                  variant={logFilter === "info" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLogFilter("info")}
                >
                  Info
                </Button>
                <Button
                  variant={logFilter === "warning" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLogFilter("warning")}
                >
                  Warning
                </Button>
                <Button
                  variant={logFilter === "error" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLogFilter("error")}
                >
                  Error
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm space-y-2 max-h-80 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-1 border-b border-border/50 last:border-0"
                >
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {log.timestamp}
                  </span>
                  {getLogLevelBadge(log.level)}
                  <span className="flex-1">{log.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ジョブ管理 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              ジョブ管理
            </CardTitle>
            <CardDescription>
              定期実行タスクの状態と手動実行
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    {getJobStatusIcon(job.status)}
                    <div>
                      <p className="font-medium">{job.name}</p>
                      <p className="text-sm text-muted-foreground">
                        スケジュール: {job.schedule}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        最終実行: {job.lastRun} · 次回実行: {job.nextRun}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      手動実行
                    </Button>
                    {job.status === "failed" && (
                      <Button variant="outline" size="sm" className="text-amber-600">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        リトライ
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

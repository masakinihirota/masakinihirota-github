"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flag,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Eye,
} from "lucide-react";
import Link from "next/link";

// Mock data
const mockReports = [
  {
    id: "1",
    type: "spam",
    content: "この投稿はスパムです。",
    contentPreview: "今だけ！○○を購入すると...",
    reporter: "user1@example.com",
    reportedUser: "spammer@example.com",
    reportedAt: "2024-12-01 10:30",
    status: "pending",
  },
  {
    id: "2",
    type: "harassment",
    content: "誹謗中傷を含んでいます。",
    contentPreview: "あなたは○○だ...",
    reporter: "user2@example.com",
    reportedUser: "baduser@example.com",
    reportedAt: "2024-12-01 09:15",
    status: "pending",
  },
  {
    id: "3",
    type: "inappropriate",
    content: "不適切なコンテンツが含まれています。",
    contentPreview: "センシティブな画像...",
    reporter: "user3@example.com",
    reportedUser: "violator@example.com",
    reportedAt: "2024-11-30 18:00",
    status: "resolved",
  },
];

const mockStats = {
  pending: 5,
  resolved: 42,
  ignored: 12,
};

export function AdminContentPage() {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "spam":
        return <Badge variant="secondary">スパム</Badge>;
      case "harassment":
        return <Badge variant="destructive">誹謗中傷</Badge>;
      case "inappropriate":
        return <Badge className="bg-amber-500">不適切</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-amber-600">未処理</Badge>;
      case "resolved":
        return <Badge variant="default">解決済み</Badge>;
      case "ignored":
        return <Badge variant="secondary">無視</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <span>コンテンツ管理</span>
        </div>
        <h1 className="text-3xl font-bold">コンテンツ管理</h1>
        <p className="text-muted-foreground mt-1">
          不適切な投稿の監視、削除、通報対応を行います
        </p>
      </div>

      {/* 統計 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">未処理</p>
                <p className="text-3xl font-bold text-amber-600">{mockStats.pending}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">解決済み</p>
                <p className="text-3xl font-bold text-green-600">{mockStats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">無視</p>
                <p className="text-3xl font-bold text-muted-foreground">{mockStats.ignored}</p>
              </div>
              <Eye className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 通報キュー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            通報キュー
          </CardTitle>
          <CardDescription>
            確認が必要な通報一覧
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(report.type)}
                      {getStatusBadge(report.status)}
                    </div>
                    <p className="font-medium">{report.content}</p>
                    <div className="text-sm text-muted-foreground">
                      <p>通報者: {report.reporter}</p>
                      <p>対象ユーザー: {report.reportedUser}</p>
                      <p>通報日時: {report.reportedAt}</p>
                    </div>
                  </div>
                </div>

                {/* 対象コンテンツプレビュー */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground mb-1">対象コンテンツ:</p>
                  <p className="text-sm">{report.contentPreview}</p>
                </div>

                {/* アクションボタン */}
                {report.status === "pending" && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      無視（問題なし）
                    </Button>
                    <Button variant="outline" size="sm" className="text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      警告送信
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      削除
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

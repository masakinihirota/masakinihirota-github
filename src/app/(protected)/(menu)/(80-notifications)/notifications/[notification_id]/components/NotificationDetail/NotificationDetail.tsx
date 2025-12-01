"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trash2, Archive, Clock, User } from "lucide-react";

/** 通知詳細の型 */
export interface NotificationDetailData {
  id: string;
  subject: string;
  sender: string;
  receivedAt: string;
  content: string;
  isRead: boolean;
  type: "system" | "info" | "warning" | "important";
  attachments?: { name: string; url: string }[];
}

interface NotificationDetailProps {
  notification: NotificationDetailData;
}

/** 通知タイプに応じたバッジのバリアントを返す */
function getTypeVariant(type: NotificationDetailData["type"]): "default" | "secondary" | "destructive" | "outline" {
  switch (type) {
    case "important":
      return "destructive";
    case "warning":
      return "default";
    case "info":
      return "secondary";
    default:
      return "outline";
  }
}

/** 通知タイプに応じたラベルを返す */
function getTypeLabel(type: NotificationDetailData["type"]): string {
  switch (type) {
    case "important":
      return "重要";
    case "warning":
      return "警告";
    case "info":
      return "お知らせ";
    default:
      return "システム";
  }
}

/**
 * 通知詳細コンポーネント
 */
export function NotificationDetail({ notification }: NotificationDetailProps) {
  const handleDelete = () => {
    // 実際にはここで削除APIを呼び出す
    console.log("Deleting notification:", notification.id);
  };

  const handleArchive = () => {
    // 実際にはここでアーカイブAPIを呼び出す
    console.log("Archiving notification:", notification.id);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-3xl">
      {/* 戻るリンク */}
      <Link
        href="/notifications"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        通知一覧に戻る
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant={getTypeVariant(notification.type)}>
                  {getTypeLabel(notification.type)}
                </Badge>
                {!notification.isRead && (
                  <Badge variant="secondary">未読</Badge>
                )}
              </div>
              <CardTitle className="text-xl">{notification.subject}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleArchive}>
                <Archive className="mr-1 h-4 w-4" />
                アーカイブ
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-1 h-4 w-4" />
                削除
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {notification.sender}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {notification.receivedAt}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 本文 */}
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{notification.content}</p>
          </div>

          {/* 添付ファイル */}
          {notification.attachments && notification.attachments.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">添付ファイル</h4>
              <ul className="space-y-1">
                {notification.attachments.map((attachment, index) => (
                  <li key={index}>
                    <a
                      href={attachment.url}
                      className="text-sm text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attachment.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

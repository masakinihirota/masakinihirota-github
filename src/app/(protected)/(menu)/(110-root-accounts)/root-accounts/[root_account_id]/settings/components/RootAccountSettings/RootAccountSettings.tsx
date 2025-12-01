/**
 * RootAccountSettings コンポーネント
 *
 * ルートアカウントの設定画面
 */
"use client";

import Link from "next/link";

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
  email: string;
  lastRestartAt?: string;
}

interface RootAccountSettingsProps {
  rootAccount: RootAccount;
}

export function RootAccountSettings({ rootAccount }: RootAccountSettingsProps) {
  const canRestart = () => {
    if (!rootAccount.lastRestartAt) return true;
    const lastRestart = new Date(rootAccount.lastRestartAt);
    const now = new Date();
    const diffHours =
      (now.getTime() - lastRestart.getTime()) / (1000 * 60 * 60);
    return diffHours >= 24;
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">🔧 ルートアカウント設定</h1>
        <p className="text-muted-foreground">
          {rootAccount.displayName} のアカウント設定を管理します
        </p>
      </div>

      {/* アカウントセキュリティ */}
      <Card>
        <CardHeader>
          <CardTitle>🔒 アカウントセキュリティ</CardTitle>
          <CardDescription>
            認証設定とセッション管理を行います
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">認証プロバイダ</p>
              <p className="text-muted-foreground text-sm">
                Google アカウントで連携中
              </p>
            </div>
            <Button variant="outline" size="sm">
              変更
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">メールアドレス</p>
              <p className="text-muted-foreground text-sm">
                {rootAccount.email}
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              変更不可
            </Button>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">セッション管理</p>
              <p className="text-muted-foreground text-sm">
                他のデバイスからログアウト
              </p>
            </div>
            <Button variant="outline" size="sm">
              全デバイスからログアウト
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ゲームプレイ設定 */}
      <Card>
        <CardHeader>
          <CardTitle>🎮 ゲームプレイ設定</CardTitle>
          <CardDescription>データ管理とリスタートを行います</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* リスタート機能 */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-900/20">
            <div className="mb-3">
              <p className="font-medium">🔄 リスタート（強くてニューゲーム）</p>
              <p className="text-muted-foreground text-sm">
                Lvとバッジを維持したまま、ポイントを1,000ptにリセットして再開します。
              </p>
            </div>
            <div className="text-muted-foreground mb-3 text-sm">
              <p>• 1日1回のみ実行可能</p>
              <p>• ポイントが 1,000pt（日次回復分）になります</p>
              <p>• レベルと実績は維持されます</p>
            </div>
            <Button
              variant="outline"
              disabled={!canRestart()}
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-400"
            >
              リスタートを実行
            </Button>
            {!canRestart() && (
              <p className="text-muted-foreground mt-2 text-xs">
                ※ 次回リスタート可能時刻まであと数時間お待ちください
              </p>
            )}
          </div>

          {/* チュートリアル再開 */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-medium">チュートリアル再開</p>
              <p className="text-muted-foreground text-sm">
                チュートリアルを最初からプレイし直す
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/tutorial">チュートリアルへ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 危険なエリア */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">⚠️ 危険なエリア</CardTitle>
          <CardDescription>
            以下の操作は取り消すことができません。慎重に実行してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
            <div className="mb-3">
              <p className="font-medium text-red-700 dark:text-red-400">
                アカウント削除（退会）
              </p>
              <p className="text-muted-foreground text-sm">
                全データを完全に削除します。この操作は復旧できません。
              </p>
            </div>
            <Button variant="destructive" size="sm">
              アカウントを削除
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 戻るボタン */}
      <div className="pt-4">
        <Button variant="outline" asChild>
          <Link href={`/root-accounts/${rootAccount.id}`}>
            ← ルートアカウントに戻る
          </Link>
        </Button>
      </div>
    </div>
  );
}

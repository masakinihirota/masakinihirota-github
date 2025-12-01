"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string;
  name: string;
  isPublic: boolean;
  joinPolicy: string;
}

interface OrganizationSettingsProps {
  organization: Organization;
  onSave?: (data: FormData) => void;
  onDissolve?: () => void;
}

export function OrganizationSettings({ organization, onSave, onDissolve }: OrganizationSettingsProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSave) {
      const formData = new FormData(e.currentTarget);
      onSave(formData);
    }
  };

  return (
    <div className="space-y-6">
      <h1 data-testid="page-title" className="text-2xl font-bold">
        組織設定
      </h1>

      {/* プロフィール編集 */}
      <Card>
        <CardHeader>
          <CardTitle>プロフィール編集</CardTitle>
          <CardDescription>組織の基本情報を編集します</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                組織名
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={organization.name}
                placeholder="組織名を入力"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                ロゴ画像
              </label>
              <Input id="logo" name="logo" type="file" accept="image/*" />
            </div>

            <div className="space-y-2">
              <label htmlFor="vision" className="text-sm font-medium">
                ビジョン
              </label>
              <textarea
                id="vision"
                name="vision"
                placeholder="組織のビジョンを入力"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={3}
              />
            </div>

            <Button type="submit">保存</Button>
          </form>
        </CardContent>
      </Card>

      {/* 公開・プライバシー */}
      <Card>
        <CardHeader>
          <CardTitle>公開・プライバシー</CardTitle>
          <CardDescription>組織の公開範囲と加入設定を管理します</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="visibility" className="text-sm font-medium">
              公開範囲
            </label>
            <select
              id="visibility"
              name="visibility"
              defaultValue={organization.isPublic ? "public" : "members"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="public">全体公開</option>
              <option value="members">メンバーのみ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="joinPolicy" className="text-sm font-medium">
              加入設定
            </label>
            <select
              id="joinPolicy"
              name="joinPolicy"
              defaultValue={organization.joinPolicy}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="open">誰でも参加可能</option>
              <option value="approval">承認制</option>
              <option value="invite">招待のみ</option>
            </select>
          </div>

          <Button type="button">設定を保存</Button>
        </CardContent>
      </Card>

      {/* 危険な設定 */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">危険な設定</CardTitle>
          <CardDescription>この操作は元に戻すことができません</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-destructive/10">
            <h4 className="font-medium text-destructive mb-2">組織の解散</h4>
            <p className="text-sm text-muted-foreground mb-4">
              組織を解散すると、全てのデータが削除され、メンバーは組織から離脱します。
              この操作は元に戻すことができません。
            </p>
            <Button variant="destructive" onClick={onDissolve}>
              組織を解散
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

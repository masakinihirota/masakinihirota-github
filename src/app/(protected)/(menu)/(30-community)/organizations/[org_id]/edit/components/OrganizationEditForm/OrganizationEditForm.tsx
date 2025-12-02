"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Organization {
  id: string;
  name: string;
  logoUrl?: string;
  headerUrl?: string;
  vision?: string;
  location?: string;
  externalLinks?: string[];
}

interface OrganizationEditFormProps {
  organization: Organization;
  onSubmit?: (data: FormData) => void;
  onCancel?: () => void;
}

export function OrganizationEditForm({ organization, onSubmit, onCancel }: OrganizationEditFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      const formData = new FormData(e.currentTarget);
      onSubmit(formData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle data-testid="card-title">組織を編集</CardTitle>
        <CardDescription>組織の公開プロフィール情報を編集します</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本情報</h3>

            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                組織名 <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                defaultValue={organization.name}
                placeholder="例: VNS開発チーム"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                ロゴ画像
              </label>
              <Input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
              />
              {organization.logoUrl && (
                <p className="text-xs text-muted-foreground">
                  現在のロゴ: {organization.logoUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="header" className="text-sm font-medium">
                ヘッダー画像
              </label>
              <Input
                id="header"
                name="header"
                type="file"
                accept="image/*"
              />
              {organization.headerUrl && (
                <p className="text-xs text-muted-foreground">
                  現在のヘッダー: {organization.headerUrl}
                </p>
              )}
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">詳細情報</h3>

            <div className="space-y-2">
              <label htmlFor="vision" className="text-sm font-medium">
                ビジョン/ミッション
              </label>
              <textarea
                id="vision"
                name="vision"
                defaultValue={organization.vision}
                placeholder="組織のビジョンやミッションを入力してください"
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                活動拠点
              </label>
              <Input
                id="location"
                name="location"
                defaultValue={organization.location}
                placeholder="例: 東京都、オンライン"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="externalLinks" className="text-sm font-medium">
                外部リンク
              </label>
              <Input
                id="externalLinks"
                name="externalLinks"
                defaultValue={organization.externalLinks?.join(", ")}
                placeholder="例: https://example.com（複数ある場合はカンマ区切り）"
              />
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              キャンセル
            </Button>
            <Button type="submit">
              保存
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

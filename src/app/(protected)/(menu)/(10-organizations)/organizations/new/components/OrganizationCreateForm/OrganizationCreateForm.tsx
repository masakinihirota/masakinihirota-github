/**
 * OrganizationCreateForm コンポーネント
 *
 * 新しい組織を作成するフォーム
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
import { Input } from "@/components/ui/input";

interface OrganizationCreateFormProps {
  onSubmit?: (data: FormData) => void;
}

export function OrganizationCreateForm({
  onSubmit,
}: OrganizationCreateFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit?.(formData);
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>🏢 組織を作成</CardTitle>
          <CardDescription>
            新しい組織を立ち上げます。組織を作成すると、メンバーを招待したり、国に参加することができます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">📋 基本情報</h3>

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  組織名 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="例: VNS開発チーム"
                  required
                />
                <p className="text-muted-foreground text-xs">
                  組織の表示名です。後から変更できます。
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="orgId" className="text-sm font-medium">
                  組織ID <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">@</span>
                  <Input
                    id="orgId"
                    name="orgId"
                    placeholder="vns-dev-team"
                    pattern="[a-z0-9-]+"
                    required
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  URLに使用されるIDです。英小文字、数字、ハイフンのみ使用可能。変更不可。
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  組織の種類 <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="company">会社</option>
                  <option value="circle">サークル</option>
                  <option value="community">コミュニティ</option>
                  <option value="npo">NPO/NGO</option>
                  <option value="other">その他</option>
                </select>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">📝 詳細情報（任意）</h3>

              <div className="space-y-2">
                <label htmlFor="vision" className="text-sm font-medium">
                  ビジョン・ミッション
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  rows={3}
                  placeholder="組織が目指す方向性や目標を記入してください"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  組織の説明
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="組織の活動内容や特徴を記入してください"
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[100px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* 注意事項 */}
            <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                ⚠️ 組織を作成するには一定のポイントが消費されます。
                作成後、代表者として自動的に設定されます。
              </p>
            </div>

            {/* ボタン */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" asChild>
                <Link href="/organizations">キャンセル</Link>
              </Button>
              <Button type="submit">作成する</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

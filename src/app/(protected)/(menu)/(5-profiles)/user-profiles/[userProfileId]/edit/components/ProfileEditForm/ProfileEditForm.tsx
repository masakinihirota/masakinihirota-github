/**
 * ProfileEditForm コンポーネント
 *
 * プロフィール編集フォーム
 * 設計書: ユーザープロフィール編集.md
 *
 * @description
 * - 現在の情報を初期値として表示
 * - 基本情報編集（表示名、自己紹介）
 * - 属性編集（役割、目的、種類）
 */

"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export interface ProfileEditFormProps {
  profile: ProfileData;
  onSubmit?: (data: ProfileData) => void;
}

export interface ProfileData {
  id: string;
  displayName: string;
  username: string;
  bio: string;
  role: string;
  purpose: string;
  type: string;
}

export function ProfileEditForm({ profile, onSubmit }: ProfileEditFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: ProfileData = {
      id: profile.id,
      displayName: formData.get("displayName") as string,
      username: profile.username, // 変更不可
      bio: formData.get("bio") as string,
      role: formData.get("role") as string,
      purpose: formData.get("purpose") as string,
      type: formData.get("type") as string,
    };
    onSubmit?.(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/profiles/${profile.id}`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← プロフィールに戻る
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold">プロフィール編集</h1>
        <p className="text-muted-foreground mt-1">
          プロフィール情報を更新します
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>📝 基本情報</CardTitle>
            <CardDescription>
              公開される基本的な情報を編集してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium leading-none">
                表示名 *
              </label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={profile.displayName}
                placeholder="例: 山田太郎"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none">
                ユーザーID
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  @
                </span>
                <Input
                  id="username"
                  name="username"
                  defaultValue={profile.username}
                  className="pl-8 bg-muted"
                  disabled
                />
              </div>
              <p className="text-xs text-muted-foreground">
                ユーザーIDは変更できません
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium leading-none">
                自己紹介
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={profile.bio}
                placeholder="自己紹介を入力してください（1000文字以内）"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={1000}
              />
            </div>
          </CardContent>
        </Card>

        {/* 属性設定 */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ 属性設定</CardTitle>
            <CardDescription>
              プロフィールの属性を編集してください
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">役割 *</span>
              <select
                name="role"
                defaultValue={profile.role}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="leader">リーダー</option>
                <option value="member">メンバー</option>
              </select>
              <p className="text-xs text-muted-foreground text-yellow-600">
                ⚠️ 役割の変更は所属組織に影響する場合があります
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">目的 *</span>
              <select
                name="purpose"
                defaultValue={profile.purpose}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="work">仕事</option>
                <option value="play">遊び</option>
                <option value="marriage">婚活</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">種類 *</span>
              <select
                name="type"
                defaultValue={profile.type}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="self">本人</option>
                <option value="interview">インタビュー</option>
                <option value="third-party">他人視点</option>
                <option value="ai">AI</option>
                <option value="fictional">架空</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* アクションボタン */}
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/profiles/${profile.id}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground h-10 rounded-md px-6 min-w-[200px]"
              >
                キャンセル
              </Link>
              <Button type="submit" className="min-w-[200px]">
                変更を保存 💾
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 危険な操作 */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">⚠️ 危険な操作</CardTitle>
            <CardDescription>
              この操作は取り消せません。十分にご注意ください。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              type="button"
              variant="destructive"
              className="w-full sm:w-auto"
            >
              プロフィールを削除
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

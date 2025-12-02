"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { User, Shield, Lock, Link2, CreditCard } from "lucide-react";

/**
 * 設定ページコンポーネント
 */
export function SettingsPage() {
  const [displayName, setDisplayName] = useState("ユーザーA");
  const [email, setEmail] = useState("user@example.com");
  const [language, setLanguage] = useState("ja");
  const [profilePublic, setProfilePublic] = useState(true);
  const [worksPublic, setWorksPublic] = useState(true);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">設定</h1>
        <p className="text-muted-foreground">
          アカウントやアプリケーションの設定を管理します
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account" className="flex items-center gap-1">
            <User className="h-4 w-4" />
            アカウント
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            プライバシー
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            セキュリティ
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-1">
            <Link2 className="h-4 w-4" />
            連携
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <CreditCard className="h-4 w-4" />
            支払い
          </TabsTrigger>
        </TabsList>

        {/* アカウント設定 */}
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>アカウント設定</CardTitle>
              <CardDescription>
                基本的なアカウント情報を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">変更</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">表示名</Label>
                <div className="flex gap-2">
                  <Input
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">変更</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">言語</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="言語を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button>保存する</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* プライバシー設定 */}
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>プライバシー設定</CardTitle>
              <CardDescription>
                公開範囲やプライバシーに関する設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>プロフィールの公開</Label>
                  <p className="text-sm text-muted-foreground">
                    プロフィールを他のユーザーに公開する
                  </p>
                </div>
                <Switch
                  checked={profilePublic}
                  onCheckedChange={setProfilePublic}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>作品リストの公開</Label>
                  <p className="text-sm text-muted-foreground">
                    作品リストを他のユーザーに公開する
                  </p>
                </div>
                <Switch
                  checked={worksPublic}
                  onCheckedChange={setWorksPublic}
                />
              </div>

              <Button>保存する</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* セキュリティ設定 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>セキュリティ設定</CardTitle>
              <CardDescription>
                パスワードや二要素認証などのセキュリティ設定を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>パスワード変更</Label>
                <Button variant="outline">パスワードを変更</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>二要素認証</Label>
                  <p className="text-sm text-muted-foreground">
                    アカウントのセキュリティを強化する
                  </p>
                </div>
                <Button variant="outline">設定する</Button>
              </div>

              <div className="border-t pt-6">
                <div className="space-y-2">
                  <Label className="text-destructive">アカウント削除</Label>
                  <p className="text-sm text-muted-foreground">
                    アカウントを完全に削除します。この操作は取り消せません。
                  </p>
                  <Button variant="destructive">アカウントを削除する</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 連携サービス */}
        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>連携サービス</CardTitle>
              <CardDescription>
                外部サービスとの連携を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Google</p>
                  <p className="text-sm text-muted-foreground">連携済み</p>
                </div>
                <Button variant="outline">連携解除</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">未連携</p>
                </div>
                <Button>連携する</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 支払い設定 */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>支払い設定</CardTitle>
              <CardDescription>
                プランや支払い方法を管理します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg">
                <p className="font-medium">現在のプラン</p>
                <p className="text-2xl font-bold">フリープラン</p>
                <Button className="mt-4">プランを変更</Button>
              </div>

              <div className="space-y-2">
                <Label>支払い履歴</Label>
                <p className="text-sm text-muted-foreground">
                  支払い履歴はありません
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

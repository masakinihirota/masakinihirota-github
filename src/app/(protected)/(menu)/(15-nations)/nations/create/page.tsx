import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Flag } from "lucide-react"

/**
 * 建国申請ページ
 */
export default function NationCreatePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/nations">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">建国申請</h1>
          <p className="text-muted-foreground mt-1">
            新しい国を建国するための申請を行います
          </p>
        </div>
      </div>

      {/* 建国費用説明 */}
      <Card className="border-primary max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            建国について
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>建国には以下の要件があります：</p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>建国費用: 10,000 ポイント</li>
            <li>月額維持費: 1,000 ポイント</li>
            <li>最低メンバー数: 3組織以上</li>
            <li>オアシス宣言への同意</li>
          </ul>
        </CardContent>
      </Card>

      {/* 申請フォーム */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>国の基本情報</CardTitle>
          <CardDescription>
            建国する国の情報を入力してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">国名</Label>
            <Input
              id="name"
              placeholder="国の名前を入力"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">国の説明</Label>
            <Textarea
              id="description"
              placeholder="国の理念や目的を説明してください"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">国のタイプ</Label>
            <select
              id="type"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">選択してください</option>
              <option value="creative">クリエイティブ国</option>
              <option value="tech">テクノロジー国</option>
              <option value="business">ビジネス国</option>
              <option value="art">アート国</option>
              <option value="education">教育国</option>
              <option value="other">その他</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">ビジョン</Label>
            <Textarea
              id="vision"
              placeholder="国として目指す将来像を記述してください"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rules">基本ルール</Label>
            <Textarea
              id="rules"
              placeholder="国民に求める基本的なルールを記述してください"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreeOasis"
              className="rounded border-gray-300"
            />
            <Label htmlFor="agreeOasis">オアシス宣言に同意します</Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="agreeTerms"
              className="rounded border-gray-300"
            />
            <Label htmlFor="agreeTerms">建国規約に同意します</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/nations">キャンセル</Link>
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              建国申請を送信
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

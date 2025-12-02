import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Flag } from "lucide-react"
import { NationCreateForm } from "./NationCreateForm"

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
        <CardContent>
          <NationCreateForm />
        </CardContent>
      </Card>
    </div>
  )
}

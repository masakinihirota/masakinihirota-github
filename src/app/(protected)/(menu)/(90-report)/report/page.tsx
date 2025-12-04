'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react'

/**
 * ペナルティ報告種別
 */
const reportTypes = [
  { value: 'spam', label: 'スパム・迷惑行為' },
  { value: 'harassment', label: 'ハラスメント・嫌がらせ' },
  { value: 'hate_speech', label: 'ヘイトスピーチ・差別表現' },
  { value: 'violence', label: '暴力・脅迫' },
  { value: 'privacy', label: 'プライバシー侵害' },
  { value: 'copyright', label: '著作権侵害' },
  { value: 'fraud', label: '詐欺・不正行為' },
  { value: 'other', label: 'その他の違反' },
]

/**
 * ペナルティ報告フォーム
 *
 * 要件定義書 PEN-F-01 に基づく違反報告受付フォーム
 * - 報告者情報（自動取得）
 * - 違反種別選択
 * - 対象者/コンテンツ指定
 * - 証拠資料（テキスト、リンク）
 */
export default function ReportPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // バリデーション
    const reportType = formData.get('reportType') as string
    const targetUser = formData.get('targetUser') as string
    const description = formData.get('description') as string

    if (!reportType) {
      setError('違反種別を選択してください')
      setIsSubmitting(false)
      return
    }

    if (!targetUser?.trim()) {
      setError('報告対象を入力してください')
      setIsSubmitting(false)
      return
    }

    if (!description?.trim()) {
      setError('詳細説明を入力してください')
      setIsSubmitting(false)
      return
    }

    // TODO: Server Actionを呼び出す
    // const result = await submitReportAction(formData)

    // モック: 成功を仮定
    setTimeout(() => {
      setSuccess(true)
      setIsSubmitting(false)
    }, 1000)
  }

  if (success) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">報告を受け付けました</h2>
              <p className="text-muted-foreground">
                ご報告ありがとうございます。調停者が内容を確認し、適切に対応いたします。
              </p>
              <Button onClick={() => router.push('/')}>
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">ペナルティ報告</h1>
          <p className="text-muted-foreground mt-1">
            違反行為を発見した場合はこちらからご報告ください
          </p>
        </div>
      </div>

      {/* 注意事項 */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p className="font-medium text-yellow-800">報告前にご確認ください</p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1">
                <li>虚偽の報告は処分の対象となる場合があります</li>
                <li>報告内容は調停者が確認し、必要に応じて追加情報をお願いする場合があります</li>
                <li>報告者の情報は非公開で処理されます</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 報告フォーム */}
      <Card>
        <CardHeader>
          <CardTitle>報告内容</CardTitle>
          <CardDescription>
            違反の詳細をできるだけ具体的にご記入ください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                {error}
              </div>
            )}

            {/* 違反種別 */}
            <div className="space-y-2">
              <Label htmlFor="reportType">違反種別 *</Label>
              <Select name="reportType">
                <SelectTrigger id="reportType">
                  <SelectValue placeholder="違反の種類を選択" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 報告対象 */}
            <div className="space-y-2">
              <Label htmlFor="targetUser">報告対象（ユーザー名/コンテンツURL）*</Label>
              <Input
                id="targetUser"
                name="targetUser"
                placeholder="例: user123 または https://example.com/content/..."
              />
              <p className="text-xs text-muted-foreground">
                違反を行ったユーザー名、または違反コンテンツのURLを入力してください
              </p>
            </div>

            {/* 詳細説明 */}
            <div className="space-y-2">
              <Label htmlFor="description">詳細説明 *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="違反行為の詳細を記入してください。いつ、どこで、何が起きたかをできるだけ具体的に..."
                rows={5}
              />
            </div>

            {/* 証拠URL */}
            <div className="space-y-2">
              <Label htmlFor="evidenceUrl">証拠URL（任意）</Label>
              <Input
                id="evidenceUrl"
                name="evidenceUrl"
                type="url"
                placeholder="https://..."
              />
              <p className="text-xs text-muted-foreground">
                スクリーンショットや関連リンクがあれば入力してください
              </p>
            </div>

            {/* 緊急フラグ */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isUrgent"
                name="isUrgent"
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="isUrgent" className="text-sm font-normal">
                緊急対応が必要（暴力・脅迫など）
              </Label>
            </div>

            {/* 送信ボタン */}
            <div className="flex gap-3">
              <Button type="submit" aria-disabled={isSubmitting}>
                {isSubmitting ? '送信中...' : '報告を送信'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

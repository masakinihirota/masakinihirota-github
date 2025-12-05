'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { createNationFormAction } from '@/actions/createNationForm.action'

interface NationCreateFormProps {
  onCancel?: () => void
}

export function NationCreateForm({ onCancel }: NationCreateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    // チェックボックスの値を適切に設定
    const agreeOasis = (e.currentTarget.querySelector('#agreeOasis') as HTMLInputElement)?.checked
    const agreeTerms = (e.currentTarget.querySelector('#agreeTerms') as HTMLInputElement)?.checked

    formData.set('agreeOasis', agreeOasis ? 'true' : 'false')
    formData.set('agreeTerms', agreeTerms ? 'true' : 'false')

    try {
      const result = await createNationFormAction(formData)

      if (result.success) {
        router.push(`/nations/${result.nationId}`)
      } else {
        setError(result.error || '建国申請に失敗しました')
      }
    } catch (err) {
      setError('予期しないエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">国名</Label>
        <Input
          id="name"
          name="name"
          placeholder="国の名前を入力"
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">国の説明</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="国の理念や目的を説明してください"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nationType">国のタイプ</Label>
        <select
          id="nationType"
          name="nationType"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          disabled={isLoading}
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
          name="vision"
          placeholder="国として目指す将来像を記述してください"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rules">基本ルール</Label>
        <Textarea
          id="rules"
          name="rules"
          placeholder="国民に求める基本的なルールを記述してください"
          rows={4}
          disabled={isLoading}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="agreeOasis"
          name="agreeOasis"
          className="rounded border-gray-300"
          disabled={isLoading}
        />
        <Label htmlFor="agreeOasis">オアシス宣言に同意します</Label>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="agreeTerms"
          name="agreeTerms"
          className="rounded border-gray-300"
          disabled={isLoading}
        />
        <Label htmlFor="agreeTerms">建国規約に同意します</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel || (() => router.push('/nations'))}
          disabled={isLoading}
        >
          キャンセル
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            '送信中...'
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              建国申請を送信
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

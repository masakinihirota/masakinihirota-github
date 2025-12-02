'use client'

import { createRootAccount } from '@/actions/root-account'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

export function InitialSetupForm() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      await createRootAccount(formData)
    } catch (error) {
      console.error(error)
      alert('エラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form action={onSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div className="mb-4">
          <Label htmlFor="displayName">表示名</Label>
          <Input id="displayName" name="displayName" required placeholder="ニックネーム" />
        </div>
        <div className="mb-4">
          <Label htmlFor="location">居住エリア (地球3分割)</Label>
          <Select name="location" required>
            <SelectTrigger>
              <SelectValue placeholder="エリアを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asia_pacific">アジア・オセアニア</SelectItem>
              <SelectItem value="europe_africa">欧州・アフリカ</SelectItem>
              <SelectItem value="americas">南北アメリカ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label htmlFor="motherTongue">母語</Label>
          <Select name="motherTongue" required>
            <SelectTrigger>
              <SelectValue placeholder="言語を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              {/* Add more as needed */}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <Label htmlFor="generation">世代</Label>
          <Select name="generation" required>
            <SelectTrigger>
              <SelectValue placeholder="世代を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gen_z">Gen Z (~2010)</SelectItem>
              <SelectItem value="millennial">Millennial (~1995)</SelectItem>
              <SelectItem value="gen_x">Gen X (~1980)</SelectItem>
              <SelectItem value="boomer">Boomer (~1965)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 mb-4">
          <Checkbox id="isAdsEnabled" name="isAdsEnabled" defaultChecked />
          <Label htmlFor="isAdsEnabled">広告を表示する (ポイント還元あり)</Label>
        </div>
      </div>

      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '設定中...' : '開始する'}
        </Button>
      </div>
    </form>
  )
}

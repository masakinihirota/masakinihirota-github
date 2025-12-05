"use client"

/**
 * 国設定コンポーネント
 * 設計書: 0130-02-国の内政設計書.md
 *
 * 機能:
 * - 基本情報編集
 * - ルール設定
 * - ペナルティ設定
 * - 加入ルール
 */

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  Shield,
  Users,
  AlertTriangle,
  Clock,
  Lock,
  Unlock,
  Save,
  Trash2,
  UserPlus,
  Ban,
  Scale,
} from "lucide-react"

// =====================================================
// 型定義
// =====================================================

export interface NationSettings {
  id: string
  name: string
  description: string

  // 加入ルール
  isPublic: boolean
  requireApproval: boolean
  minTrustDays: number // 信用期間（日数）

  // ペナルティルール
  penaltyHolderRule: "founder" | "nation" | "shared"
  yellowCardLimit: number
  penaltyRetryDays: number

  // 脱退ルール
  allowLeave: boolean
  leaveNoticeDays: number

  // マーケットルール
  marketTaxRate: number // パーセント
  maxLoanRate: number // 信用度に対する借入倍率

  // その他
  customRulesText?: string
}

export interface NationSettingsProps {
  settings: NationSettings
  isOwner?: boolean
  onSave?: (settings: Partial<NationSettings>) => Promise<void>
  onDelete?: () => Promise<void>
  isLoading?: boolean
}

// =====================================================
// サブコンポーネント
// =====================================================

function BasicInfoSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          基本情報
        </CardTitle>
        <CardDescription>
          国の名前と説明を編集できます
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nation-name">国名</Label>
          <Input
            id="nation-name"
            value={settings.name}
            onChange={(e) => onUpdate("name", e.target.value)}
            disabled={disabled}
            placeholder="国の名前"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nation-description">説明</Label>
          <Textarea
            id="nation-description"
            value={settings.description}
            onChange={(e) => onUpdate("description", e.target.value)}
            disabled={disabled}
            placeholder="国の説明やビジョン"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function JoinRulesSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          加入ルール
        </CardTitle>
        <CardDescription>
          新メンバーの加入条件を設定します
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              {settings.isPublic ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              公開設定
            </Label>
            <p className="text-sm text-muted-foreground">
              公開にすると国一覧に表示されます
            </p>
          </div>
          <Switch
            checked={settings.isPublic}
            onCheckedChange={(checked) => onUpdate("isPublic", checked)}
            disabled={disabled}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              承認制
            </Label>
            <p className="text-sm text-muted-foreground">
              加入申請を管理者が承認する必要があります
            </p>
          </div>
          <Switch
            checked={settings.requireApproval}
            onCheckedChange={(checked) => onUpdate("requireApproval", checked)}
            disabled={disabled}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            信用期間
          </Label>
          <p className="text-sm text-muted-foreground">
            加入後、この期間は一部機能が制限されます
          </p>
          <Select
            value={String(settings.minTrustDays)}
            onValueChange={(v) => onUpdate("minTrustDays", Number(v))}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">なし</SelectItem>
              <SelectItem value="7">7日間</SelectItem>
              <SelectItem value="14">14日間</SelectItem>
              <SelectItem value="30">30日間</SelectItem>
              <SelectItem value="60">60日間</SelectItem>
              <SelectItem value="90">90日間</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

function PenaltyRulesSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          ペナルティルール
        </CardTitle>
        <CardDescription>
          ルール違反時のペナルティ設定です
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            ペナルティ保持者
          </Label>
          <p className="text-sm text-muted-foreground">
            誰がペナルティの記録を管理するか
          </p>
          <Select
            value={settings.penaltyHolderRule}
            onValueChange={(v) => onUpdate("penaltyHolderRule", v)}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="founder">創設者のみ</SelectItem>
              <SelectItem value="nation">国（共有）</SelectItem>
              <SelectItem value="shared">共有（関係者全員）</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            イエローカード上限
          </Label>
          <p className="text-sm text-muted-foreground">
            この回数を超えるとレッドカード（退場）となります
          </p>
          <Select
            value={String(settings.yellowCardLimit)}
            onValueChange={(v) => onUpdate("yellowCardLimit", Number(v))}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1回</SelectItem>
              <SelectItem value="2">2回</SelectItem>
              <SelectItem value="3">3回（デフォルト）</SelectItem>
              <SelectItem value="5">5回</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            再加入待機期間
          </Label>
          <p className="text-sm text-muted-foreground">
            レッドカード後、再加入できるまでの日数
          </p>
          <Select
            value={String(settings.penaltyRetryDays)}
            onValueChange={(v) => onUpdate("penaltyRetryDays", Number(v))}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30日</SelectItem>
              <SelectItem value="60">60日</SelectItem>
              <SelectItem value="90">90日（デフォルト）</SelectItem>
              <SelectItem value="180">180日</SelectItem>
              <SelectItem value="365">1年</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

function LeaveRulesSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          脱退ルール
        </CardTitle>
        <CardDescription>
          メンバーの脱退に関する設定です
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>自由脱退</Label>
            <p className="text-sm text-muted-foreground">
              メンバーがいつでも脱退できるようにする
            </p>
          </div>
          <Switch
            checked={settings.allowLeave}
            onCheckedChange={(checked) => onUpdate("allowLeave", checked)}
            disabled={disabled}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>脱退予告期間</Label>
          <p className="text-sm text-muted-foreground">
            脱退申請から実際に脱退できるまでの期間
          </p>
          <Select
            value={String(settings.leaveNoticeDays)}
            onValueChange={(v) => onUpdate("leaveNoticeDays", Number(v))}
            disabled={disabled}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">即時</SelectItem>
              <SelectItem value="7">7日間</SelectItem>
              <SelectItem value="14">14日間</SelectItem>
              <SelectItem value="30">30日間</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

function MarketRulesSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5" />
          マーケット・経済ルール
        </CardTitle>
        <CardDescription>
          取引やローンに関する設定です
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>マーケット手数料率</Label>
          <p className="text-sm text-muted-foreground">
            取引成立時に国庫に入る手数料（%）
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={settings.marketTaxRate}
              onChange={(e) => onUpdate("marketTaxRate", Number(e.target.value))}
              disabled={disabled}
              className="w-[100px]"
              min={0}
              max={50}
            />
            <span className="text-muted-foreground">%</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>ローン上限倍率</Label>
          <p className="text-sm text-muted-foreground">
            信用度に対する最大借入倍率
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={settings.maxLoanRate}
              onChange={(e) => onUpdate("maxLoanRate", Number(e.target.value))}
              disabled={disabled}
              className="w-[100px]"
              min={0}
              max={10}
              step={0.1}
            />
            <span className="text-muted-foreground">倍</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomRulesSection({
  settings,
  onUpdate,
  disabled,
}: {
  settings: NationSettings
  onUpdate: (key: keyof NationSettings, value: any) => void
  disabled?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>カスタムルール</CardTitle>
        <CardDescription>
          その他のルールを自由記述できます（マークダウン対応）
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          value={settings.customRulesText || ""}
          onChange={(e) => onUpdate("customRulesText", e.target.value)}
          disabled={disabled}
          placeholder="例: 毎週月曜日に定例ミーティングを開催します。"
          rows={6}
        />
      </CardContent>
    </Card>
  )
}

function DangerZone({
  onDelete,
  isLoading,
}: {
  onDelete?: () => Promise<void>
  isLoading?: boolean
}) {
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          危険なアクション
        </CardTitle>
        <CardDescription>
          以下の操作は取り消せません
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isLoading}>
              <Trash2 className="h-4 w-4 mr-2" />
              国を解散する
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>国を解散しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。すべてのメンバーは国から除外され、
                国庫のポイントはオーナーに返還されます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                解散する
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

// =====================================================
// メインコンポーネント
// =====================================================

export function NationSettings({
  settings: initialSettings,
  isOwner = false,
  onSave,
  onDelete,
  isLoading = false,
}: NationSettingsProps) {
  const [settings, setSettings] = useState<NationSettings>(initialSettings)
  const [hasChanges, setHasChanges] = useState(false)

  const handleUpdate = (key: keyof NationSettings, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!onSave) return
    await onSave(settings)
    setHasChanges(false)
  }

  const handleReset = () => {
    setSettings(initialSettings)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            国の設定
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            国のルールや設定を管理します
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
              未保存の変更があります
            </Badge>
            <Button variant="outline" onClick={handleReset} disabled={isLoading}>
              リセット
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
          </div>
        )}
      </div>

      {/* 設定セクション */}
      <div className="grid gap-6">
        <BasicInfoSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />
        <JoinRulesSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />
        <PenaltyRulesSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />
        <LeaveRulesSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />
        <MarketRulesSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />
        <CustomRulesSection
          settings={settings}
          onUpdate={handleUpdate}
          disabled={!isOwner || isLoading}
        />

        {/* 危険ゾーン */}
        {isOwner && onDelete && (
          <DangerZone onDelete={onDelete} isLoading={isLoading} />
        )}
      </div>
    </div>
  )
}

export default NationSettings

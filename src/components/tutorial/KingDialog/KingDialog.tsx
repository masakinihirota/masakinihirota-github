/**
 * @file 王様ダイアログコンポーネント
 * @description Task 12.1: チュートリアル導線の実装
 *
 * チュートリアル詳細設計書 Section 6 に基づく
 * ルート選択画面の実装
 */
'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TutorialRoute, TutorialRouteType, getTutorialRouteDescription } from '@/lib/tutorial'

interface KingDialogProps {
  /** ルート選択時のコールバック */
  onSelectRoute: (route: TutorialRouteType) => void
  /** カスタム王様メッセージ */
  message?: string
  /** 無効化 */
  disabled?: boolean
}

/**
 * 王様との対話ダイアログ
 * プロフィール作成後にユーザーにルートを選択させる
 */
export function KingDialog({ onSelectRoute, message, disabled }: KingDialogProps) {
  const defaultMessage = 'さて、準備は整った。お主はこれから、この世界で何を成したい？'

  const routes = [
    { route: TutorialRoute.ORGANIZATION, variant: 'default' as const },
    { route: TutorialRoute.NATION, variant: 'default' as const },
    { route: TutorialRoute.BOTH, variant: 'secondary' as const },
    { route: TutorialRoute.SKIP, variant: 'outline' as const },
  ]

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-3xl">👑</span>
          <span>王様からの問いかけ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 王様のメッセージ */}
        <div className="bg-accent/50 rounded-lg p-4 text-center">
          <p className="text-lg font-medium">
            {message ?? defaultMessage}
          </p>
        </div>

        {/* ルート選択ボタン */}
        <div className="grid grid-cols-2 gap-4">
          {routes.map(({ route, variant }) => {
            const desc = getTutorialRouteDescription(route)
            return (
              <Button
                key={route}
                variant={variant}
                className="h-auto flex flex-col items-center gap-2 p-4"
                onClick={() => onSelectRoute(route)}
                disabled={disabled}
              >
                <span className="text-2xl">{desc.icon}</span>
                <span className="font-semibold">{desc.title}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default KingDialog

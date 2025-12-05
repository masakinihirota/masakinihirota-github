/**
 * @file ルート選択ページ
 * @description Task 12.1: チュートリアル導線の実装
 *
 * チュートリアル詳細設計書 Section 6 に基づく
 * 王様との対話によるルート選択画面
 */
'use client'

import { useRouter } from 'next/navigation'
import { KingDialog } from '@/components/tutorial'
import { TutorialRouteType, TutorialRoute } from '@/lib/tutorial'

/**
 * ルート選択ページ
 * プロフィール作成後に表示され、ユーザーにチュートリアルルートを選択させる
 */
export default function RouteSelectionPage() {
  const router = useRouter()

  const handleSelectRoute = (route: TutorialRouteType) => {
    // ルートに応じたリダイレクト先を決定
    switch (route) {
      case TutorialRoute.ORGANIZATION:
        // 組織編: 組織作成ページへ
        router.push('/groups/new')
        break
      case TutorialRoute.NATION:
        // 国編: 国一覧ページへ
        router.push('/nations')
        break
      case TutorialRoute.BOTH:
        // 両方: 組織作成から開始
        router.push('/groups/new')
        break
      case TutorialRoute.SKIP:
        // スキップ: ホームへ
        router.push('/home')
        break
      default:
        router.push('/home')
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="space-y-6">
        {/* ページタイトル */}
        <div className="text-center">
          <h1 className="text-2xl font-bold">ルート選択</h1>
          <p className="text-muted-foreground mt-2">
            これからの冒険のスタイルを選びましょう
          </p>
        </div>

        {/* 王様ダイアログ */}
        <KingDialog onSelectRoute={handleSelectRoute} />

        {/* 説明テキスト */}
        <div className="text-center text-sm text-muted-foreground">
          <p>どのルートを選んでも、後から自由に他の機能を利用できます</p>
        </div>
      </div>
    </div>
  )
}

/**
 * @file チュートリアルプロンプトコンポーネント
 * @description Task 12.1: チュートリアル導線の実装
 *
 * ホームページに表示するチュートリアル導線バナー
 */
'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, GraduationCap } from 'lucide-react'
import { TutorialStatus, TutorialStatusType, shouldShowTutorialPrompt } from '@/lib/tutorial'

interface TutorialPromptProps {
  /** チュートリアルステータス */
  status: TutorialStatusType
  /** 現在のレベル */
  currentLevel: number
  /** 進捗パーセンテージ */
  progress?: number
  /** 次のステップのタイトル */
  nextStepTitle: string
  /** 次のステップのリンク先 */
  nextStepHref: string
}

/**
 * チュートリアル導線プロンプト
 * ホームページなどに表示してユーザーをチュートリアルに誘導
 */
export function TutorialPrompt({
  status,
  currentLevel,
  progress = 0,
  nextStepTitle,
  nextStepHref,
}: TutorialPromptProps) {
  // 表示判定
  if (!shouldShowTutorialPrompt(status, currentLevel)) {
    return null
  }

  const isNotStarted = status === TutorialStatus.NOT_STARTED

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
      <CardContent className="py-4">
        <div className="flex items-center justify-between gap-4">
          {/* 左側: アイコンとテキスト */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">
                {isNotStarted ? 'チュートリアルを始めよう' : 'チュートリアル進行中'}
              </p>
              <p className="text-sm text-muted-foreground">
                {isNotStarted
                  ? '基本的な使い方を学びましょう'
                  : `次のステップ: ${nextStepTitle}`}
              </p>
            </div>
          </div>

          {/* 中央: 進捗とレベル */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <span className="text-sm font-medium text-primary">Lv.{currentLevel}</span>
            {progress > 0 && (
              <span className="text-xs text-muted-foreground">{progress}% 完了</span>
            )}
          </div>

          {/* 右側: ボタン */}
          <Link href={nextStepHref}>
            <Button variant="default" size="sm" className="gap-1">
              {isNotStarted ? '始める' : '続ける'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default TutorialPrompt

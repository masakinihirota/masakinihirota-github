/**
 * WorkActions コンポーネント
 *
 * Task 7.3: スキ/拍手（ポイント消費）と履歴記録
 *
 * 作品に対するスキ（いいね）と拍手（ポイント消費）を行うためのコンポーネント
 */

'use client'

import { Button } from "@/components/ui/button"
import { Heart, HandHeart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

// 型定義
export interface OnLikeResult {
  success: boolean
  error?: string
}

export interface OnClapResult {
  success: boolean
  newClaps?: number
  error?: string
}

export type OnLikeCallback = (params: { liked: boolean }) => Promise<OnLikeResult>
export type OnClapCallback = (params: { count: number }) => Promise<OnClapResult>

type WorkActionsProps = {
  workId: string
  profileId: string
  initialLiked?: boolean
  initialClaps?: number
  clapCost?: number
  availablePoints?: number
  onLike?: OnLikeCallback
  onClap?: OnClapCallback
  disabled?: boolean
}

export const WorkActions = ({
  workId,
  profileId,
  initialLiked = false,
  initialClaps = 0,
  clapCost = 10,
  availablePoints = Infinity,
  onLike,
  onClap,
  disabled = false,
}: WorkActionsProps) => {
  const [liked, setLiked] = useState(initialLiked)
  const [claps, setClaps] = useState(initialClaps)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isClapLoading, setIsClapLoading] = useState(false)

  const isPointsInsufficient = availablePoints < clapCost

  const handleLike = async () => {
    if (disabled || isLikeLoading || !onLike) return

    setIsLikeLoading(true)
    try {
      const newLiked = !liked
      const result = await onLike({ liked: newLiked })
      if (result.success) {
        setLiked(newLiked)
      }
    } finally {
      setIsLikeLoading(false)
    }
  }

  const handleClap = async () => {
    if (disabled || isClapLoading || isPointsInsufficient || !onClap) return

    setIsClapLoading(true)
    try {
      const result = await onClap({ count: 1 })
      if (result.success && result.newClaps !== undefined) {
        setClaps(result.newClaps)
      }
    } finally {
      setIsClapLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4" data-testid={`work-actions-${workId}`}>
      {/* スキボタン */}
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={handleLike}
        aria-disabled={disabled || isLikeLoading}
        data-liked={liked ? 'true' : 'false'}
        className={cn(
          liked && "bg-pink-500 hover:bg-pink-600 text-white"
        )}
        aria-label="スキ"
      >
        <Heart className={cn("h-4 w-4 mr-1", liked && "fill-current")} />
        スキ
      </Button>

      {/* 拍手ボタン */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleClap}
          aria-disabled={disabled || isClapLoading || isPointsInsufficient}
          aria-label="拍手"
        >
          <HandHeart className="h-4 w-4 mr-1" />
          拍手
        </Button>
        <span className="text-sm text-muted-foreground">{claps}</span>
        <span className="text-xs text-muted-foreground">({clapCost}pt)</span>
      </div>

      {/* ポイント不足警告 */}
      {isPointsInsufficient && (
        <span className="text-xs text-red-500">ポイント不足</span>
      )}
    </div>
  )
}

export default WorkActions

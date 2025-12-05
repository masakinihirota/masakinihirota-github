/**
 * WorkRating コンポーネント
 *
 * Task 7.2: 時制（今/人生/未来）+ティア評価 UI
 *
 * 作品に対する時制選択とティア評価を行うためのコンポーネント
 */

'use client'

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useState } from "react"

// 型定義
export type WorkRatingStatus = 'now' | 'life' | 'future'
export type WorkRatingTier = -1 | 0 | 1 | 2 | 3

// 時制ラベル
const STATUS_LABELS: Record<WorkRatingStatus, string> = {
  now: '今',
  life: '人生',
  future: '未来',
}

// ティアラベルと説明
const TIER_CONFIG: Record<number, { label: string; description: string }> = {
  1: {
    label: 'Tier1',
    description: '時間を無理矢理にでも作ってでも見るべき作品。言葉の壁を超えてでも見てほしい作品。',
  },
  2: {
    label: 'Tier2',
    description: '強くおすすめしたい作品。特に好きな要素が際立っている作品。',
  },
  3: {
    label: 'Tier3',
    description: '好きな人には十分楽しめる作品。個人的に刺さるポイントがある。',
  },
  0: {
    label: '普通',
    description: '特に目立った特徴はないが、良い作品。',
  },
  [-1]: {
    label: '合わない',
    description: '自分に合わなかった作品。Not for me。',
  },
}

// ティアの順序
const TIER_ORDER: WorkRatingTier[] = [1, 2, 3, 0, -1]

type WorkRatingProps = {
  workId: string
  initialStatus?: WorkRatingStatus
  initialTier?: WorkRatingTier
  onStatusChange?: (status: WorkRatingStatus) => void
  onTierChange?: (tier: WorkRatingTier) => void
  disabled?: boolean
}

export const WorkRating = ({
  workId,
  initialStatus,
  initialTier,
  onStatusChange,
  onTierChange,
  disabled = false,
}: WorkRatingProps) => {
  const [selectedStatus, setSelectedStatus] = useState<WorkRatingStatus | undefined>(initialStatus)
  const [selectedTier, setSelectedTier] = useState<WorkRatingTier | undefined>(initialTier)

  const handleStatusChange = (status: WorkRatingStatus) => {
    setSelectedStatus(status)
    onStatusChange?.(status)
  }

  const handleTierChange = (tier: WorkRatingTier) => {
    setSelectedTier(tier)
    onTierChange?.(tier)
  }

  return (
    <TooltipProvider>
      <div className="space-y-4" data-testid={`work-rating-${workId}`}>
        {/* 時制選択 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">時制</h4>
          <div className="flex gap-2">
            {(Object.keys(STATUS_LABELS) as WorkRatingStatus[]).map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusChange(status)}
                aria-disabled={disabled}
                data-selected={selectedStatus === status ? 'true' : 'false'}
              >
                {STATUS_LABELS[status]}
              </Button>
            ))}
          </div>
        </div>

        {/* ティア評価 */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">評価</h4>
          <div className="flex flex-wrap gap-2">
            {TIER_ORDER.map((tier) => (
              <Tooltip key={tier}>
                <TooltipTrigger asChild>
                  <Button
                    variant={selectedTier === tier ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTierChange(tier)}
                    aria-disabled={disabled}
                    data-selected={selectedTier === tier ? 'true' : 'false'}
                    aria-label={`${TIER_CONFIG[tier].label}: ${TIER_CONFIG[tier].description}`}
                    className={cn(
                      tier === 1 && selectedTier === tier && "bg-amber-500 hover:bg-amber-600",
                      tier === 2 && selectedTier === tier && "bg-orange-500 hover:bg-orange-600",
                      tier === 3 && selectedTier === tier && "bg-yellow-500 hover:bg-yellow-600",
                      tier === -1 && selectedTier === tier && "bg-gray-500 hover:bg-gray-600",
                    )}
                  >
                    {TIER_CONFIG[tier].label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>{TIER_CONFIG[tier].description}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default WorkRating

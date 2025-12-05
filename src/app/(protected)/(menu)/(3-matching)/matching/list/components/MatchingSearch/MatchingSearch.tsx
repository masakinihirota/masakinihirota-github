/**
 * @file MatchingSearch.tsx
 * @description 手動マッチング条件検索 UI コンポーネント
 *
 * 設計書: マッチング一覧.md に基づく実装
 * - キーワード検索（ユーザー名、価値観）
 * - フィルタ（一致度、目的、場所）
 * - ソート（スコア順、更新順）
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SlidersHorizontal } from 'lucide-react'

export interface MatchingSearchFilters {
  keyword?: string
  minScore?: number
  maxScore?: number
  sortBy?: 'score' | 'updated_at' | 'match_relevance'
  sortOrder?: 'asc' | 'desc'
  valueCategories?: string[]
  location?: string
}

interface MatchingSearchProps {
  onSearch: (filters: MatchingSearchFilters) => void
  initialFilters?: MatchingSearchFilters
  isLoading?: boolean
}

/**
 * マッチング条件検索コンポーネント
 */
export function MatchingSearch({
  onSearch,
  initialFilters,
  isLoading = false,
}: MatchingSearchProps) {
  const [filters, setFilters] = useState<MatchingSearchFilters>({
    keyword: initialFilters?.keyword ?? '',
    minScore: initialFilters?.minScore,
    sortBy: initialFilters?.sortBy ?? 'score',
    sortOrder: initialFilters?.sortOrder ?? 'desc',
    ...initialFilters,
  })

  // デバウンス用のタイマー
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  // キーワード入力時のデバウンス処理
  const handleKeywordChange = useCallback(
    (value: string) => {
      setFilters((prev) => ({ ...prev, keyword: value }))

      // 既存のタイマーをクリア
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // 新しいタイマーを設定（300ms後に検索実行）
      const timer = setTimeout(() => {
        onSearch({ ...filters, keyword: value })
      }, 300)
      setDebounceTimer(timer)
    },
    [filters, onSearch, debounceTimer]
  )

  // ソート変更時（即時実行）
  const handleSortChange = useCallback(
    (value: string) => {
      const newFilters = { ...filters, sortBy: value as MatchingSearchFilters['sortBy'] }
      setFilters(newFilters)
      onSearch(newFilters)
    },
    [filters, onSearch]
  )

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
    }
  }, [debounceTimer])

  return (
    <div className="space-y-4">
      {/* 検索・フィルタ・ソートエリア */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {/* キーワード検索 */}
        <div className="flex-1">
          <Label htmlFor="keyword-search" className="sr-only">
            キーワード検索
          </Label>
          <Input
            id="keyword-search"
            type="text"
            placeholder="名前や価値観で検索..."
            value={filters.keyword ?? ''}
            onChange={(e) => handleKeywordChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* フィルタボタン */}
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          フィルタ
        </Button>

        {/* ソート選択 */}
        <div className="w-full sm:w-auto">
          <Label htmlFor="sort-select" className="sr-only">
            ソート
          </Label>
          <Select
            value={filters.sortBy ?? 'score'}
            onValueChange={handleSortChange}
            disabled={isLoading}
          >
            <SelectTrigger id="sort-select" className="w-full sm:w-[180px]" aria-label="ソート">
              <SelectValue placeholder="並び替え" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">スコア順</SelectItem>
              <SelectItem value="updated_at">更新順</SelectItem>
              <SelectItem value="match_relevance">関連度順</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* フィルタ詳細（将来的に展開可能） */}
      {/* TODO: フィルタモーダル/ドロワーの実装 */}
    </div>
  )
}

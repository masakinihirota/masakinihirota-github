/**
 * @file MatchingSearch.test.tsx
 * @description TDD RED - 手動マッチング条件検索 UI のテスト
 * @vitest-environment jsdom
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MatchingSearch, type MatchingSearchFilters } from './MatchingSearch'

describe('MatchingSearch', () => {
  const mockOnSearch = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('キーワード検索ボックスを表示する', () => {
    render(<MatchingSearch onSearch={mockOnSearch} />)

    expect(screen.getByPlaceholderText('名前や価値観で検索...')).toBeInTheDocument()
  })

  it('フィルタボタンを表示する', () => {
    render(<MatchingSearch onSearch={mockOnSearch} />)

    expect(screen.getByRole('button', { name: /フィルタ/i })).toBeInTheDocument()
  })

  it('ソート選択を表示する', () => {
    render(<MatchingSearch onSearch={mockOnSearch} />)

    expect(screen.getByRole('combobox', { name: /ソート/i })).toBeInTheDocument()
  })

  it('キーワード入力時にonSearchが呼ばれる', async () => {
    render(<MatchingSearch onSearch={mockOnSearch} />)

    const searchInput = screen.getByPlaceholderText('名前や価値観で検索...')
    fireEvent.change(searchInput, { target: { value: '映画' } })

    // デバウンス後に呼ばれることを確認（300ms待機）
    await new Promise(resolve => setTimeout(resolve, 400))

    expect(mockOnSearch).toHaveBeenCalledWith(
      expect.objectContaining({ keyword: '映画' })
    )
  })

  it('初期のソート値としてscoreが設定される', () => {
    render(<MatchingSearch onSearch={mockOnSearch} />)

    // デフォルトのソート値が「スコア順」であることを確認
    const sortTrigger = screen.getByRole('combobox', { name: /ソート/i })
    expect(sortTrigger).toHaveTextContent('スコア順')
  })

  it('初期値でフィルタを設定できる', () => {
    const initialFilters: MatchingSearchFilters = {
      keyword: 'プログラミング',
      minScore: 70,
      sortBy: 'score',
    }

    render(<MatchingSearch onSearch={mockOnSearch} initialFilters={initialFilters} />)

    const searchInput = screen.getByPlaceholderText('名前や価値観で検索...')
    expect(searchInput).toHaveValue('プログラミング')
  })

  it('初期ソートをupdated_atで設定できる', () => {
    const initialFilters: MatchingSearchFilters = {
      sortBy: 'updated_at',
    }

    render(<MatchingSearch onSearch={mockOnSearch} initialFilters={initialFilters} />)

    const sortTrigger = screen.getByRole('combobox', { name: /ソート/i })
    expect(sortTrigger).toHaveTextContent('更新順')
  })
})

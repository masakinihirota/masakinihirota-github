/**
 * @file ルート選択ページのユニットテスト
 * @description Task 12.1: チュートリアル導線の実装
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import RouteSelectionPage from './page'

// DB モジュールをモック
vi.mock('@/db', () => ({
  db: {
    execute: vi.fn().mockResolvedValue(undefined),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  },
}))

// Next.js の useRouter をモック
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

describe('RouteSelectionPage', () => {
  it('should render page title', () => {
    render(<RouteSelectionPage />)
    expect(screen.getByText(/ルート選択/)).toBeInTheDocument()
  })

  it('should render king dialog', () => {
    render(<RouteSelectionPage />)
    expect(screen.getByText(/王様からの問いかけ/)).toBeInTheDocument()
  })

  it('should render all route options', () => {
    render(<RouteSelectionPage />)
    expect(screen.getByText(/組織を育てたい/)).toBeInTheDocument()
    expect(screen.getByText(/仲間を探したい/)).toBeInTheDocument()
    expect(screen.getByText(/両方やりたい/)).toBeInTheDocument()
    expect(screen.getByText(/自由にさせて/)).toBeInTheDocument()
  })
})

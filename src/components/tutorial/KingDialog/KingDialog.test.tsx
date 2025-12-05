/**
 * @file 王様ダイアログコンポーネントのユニットテスト
 * @description Task 12.1: チュートリアル導線の実装
 *
 * 詳細設計書に基づく王様AIとの対話UI
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { KingDialog } from './KingDialog'
import { TutorialRoute } from '@/lib/tutorial'

describe('KingDialog', () => {
  describe('rendering', () => {
    it('should render king message', () => {
      render(<KingDialog onSelectRoute={vi.fn()} />)
      expect(screen.getByText(/準備は整った/)).toBeInTheDocument()
    })

    it('should render all route options', () => {
      render(<KingDialog onSelectRoute={vi.fn()} />)
      expect(screen.getByText(/組織を育てたい/)).toBeInTheDocument()
      expect(screen.getByText(/仲間を探したい/)).toBeInTheDocument()
      expect(screen.getByText(/両方やりたい/)).toBeInTheDocument()
      expect(screen.getByText(/自由にさせて/)).toBeInTheDocument()
    })

    it('should render route icons', () => {
      render(<KingDialog onSelectRoute={vi.fn()} />)
      expect(screen.getByText('🏰')).toBeInTheDocument()
      expect(screen.getByText('🗺️')).toBeInTheDocument()
      expect(screen.getByText('⚔️')).toBeInTheDocument()
      expect(screen.getByText('🕊️')).toBeInTheDocument()
    })

    it('should render custom king message when provided', () => {
      const customMessage = 'カスタムメッセージ'
      render(<KingDialog onSelectRoute={vi.fn()} message={customMessage} />)
      expect(screen.getByText(customMessage)).toBeInTheDocument()
    })
  })

  describe('interactions', () => {
    it('should call onSelectRoute with ORGANIZATION when org button clicked', () => {
      const onSelectRoute = vi.fn()
      render(<KingDialog onSelectRoute={onSelectRoute} />)

      fireEvent.click(screen.getByText(/組織を育てたい/))
      expect(onSelectRoute).toHaveBeenCalledWith(TutorialRoute.ORGANIZATION)
    })

    it('should call onSelectRoute with NATION when nation button clicked', () => {
      const onSelectRoute = vi.fn()
      render(<KingDialog onSelectRoute={onSelectRoute} />)

      fireEvent.click(screen.getByText(/仲間を探したい/))
      expect(onSelectRoute).toHaveBeenCalledWith(TutorialRoute.NATION)
    })

    it('should call onSelectRoute with BOTH when both button clicked', () => {
      const onSelectRoute = vi.fn()
      render(<KingDialog onSelectRoute={onSelectRoute} />)

      fireEvent.click(screen.getByText(/両方やりたい/))
      expect(onSelectRoute).toHaveBeenCalledWith(TutorialRoute.BOTH)
    })

    it('should call onSelectRoute with SKIP when skip button clicked', () => {
      const onSelectRoute = vi.fn()
      render(<KingDialog onSelectRoute={onSelectRoute} />)

      fireEvent.click(screen.getByText(/自由にさせて/))
      expect(onSelectRoute).toHaveBeenCalledWith(TutorialRoute.SKIP)
    })
  })

  describe('accessibility', () => {
    it('should have proper button roles', () => {
      render(<KingDialog onSelectRoute={vi.fn()} />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBe(4)
    })
  })
})

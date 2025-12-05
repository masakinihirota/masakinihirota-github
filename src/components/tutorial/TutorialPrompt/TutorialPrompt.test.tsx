/**
 * @file チュートリアルプロンプトコンポーネントのユニットテスト
 * @description Task 12.1: チュートリアル導線の実装
 *
 * ホームページに表示するチュートリアル導線バナー
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TutorialPrompt } from './TutorialPrompt'
import { TutorialStatus } from '@/lib/tutorial'

// Next.js Link をモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('TutorialPrompt', () => {
  describe('rendering', () => {
    it('should render for not started tutorial', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.NOT_STARTED}
          currentLevel={0}
          nextStepTitle="ログイン完了"
          nextStepHref="/login"
        />
      )
      expect(screen.getByText(/チュートリアル/)).toBeInTheDocument()
    })

    it('should show next step title', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.IN_PROGRESS}
          currentLevel={1}
          nextStepTitle="プロフィール作成"
          nextStepHref="/user-profiles"
        />
      )
      expect(screen.getByText(/プロフィール作成/)).toBeInTheDocument()
    })

    it('should show progress percentage', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.IN_PROGRESS}
          currentLevel={2}
          progress={50}
          nextStepTitle="ルート選択"
          nextStepHref="/tutorial/route-selection"
        />
      )
      expect(screen.getByText(/50%/)).toBeInTheDocument()
    })

    it('should render link to next step', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.IN_PROGRESS}
          currentLevel={1}
          nextStepTitle="プロフィール作成"
          nextStepHref="/user-profiles"
        />
      )
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/user-profiles')
    })
  })

  describe('visibility', () => {
    it('should not render for completed tutorial', () => {
      const { container } = render(
        <TutorialPrompt
          status={TutorialStatus.COMPLETED}
          currentLevel={3}
          nextStepTitle=""
          nextStepHref=""
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should not render for skipped tutorial', () => {
      const { container } = render(
        <TutorialPrompt
          status={TutorialStatus.SKIPPED}
          currentLevel={3}
          nextStepTitle=""
          nextStepHref=""
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render for in progress tutorial', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.IN_PROGRESS}
          currentLevel={1}
          nextStepTitle="プロフィール作成"
          nextStepHref="/user-profiles"
        />
      )
      expect(screen.getByText(/チュートリアル/)).toBeInTheDocument()
    })
  })

  describe('current level display', () => {
    it('should display current level', () => {
      render(
        <TutorialPrompt
          status={TutorialStatus.IN_PROGRESS}
          currentLevel={2}
          nextStepTitle="ルート選択"
          nextStepHref="/tutorial/route-selection"
        />
      )
      expect(screen.getByText(/Lv.2/)).toBeInTheDocument()
    })
  })
})

/**
 * @vitest-environment jsdom
 */
/**
 * WorkActions コンポーネント テスト
 *
 * TDD RED フェーズ: Task 7.3 - スキ/拍手（ポイント消費）と履歴記録
 *
 * テスト対象:
 * - スキボタンの表示と切り替え
 * - 拍手ボタンの表示と回数カウント
 * - ポイント消費の表示
 * - コールバック呼び出し
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WorkActions } from './WorkActions'

describe('WorkActions', () => {
  const defaultProps = {
    workId: 'work-123',
    profileId: 'profile-456',
    onLike: vi.fn(),
    onClap: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('初期表示', () => {
    it('スキボタンが表示される', () => {
      render(<WorkActions {...defaultProps} />)

      expect(screen.getByRole('button', { name: /スキ/i })).toBeInTheDocument()
    })

    it('拍手ボタンが表示される', () => {
      render(<WorkActions {...defaultProps} />)

      expect(screen.getByRole('button', { name: /拍手/i })).toBeInTheDocument()
    })

    it('スキが既に押されている場合、選択状態で表示される', () => {
      render(<WorkActions {...defaultProps} initialLiked={true} />)

      const likeButton = screen.getByRole('button', { name: /スキ/i })
      expect(likeButton).toHaveAttribute('data-liked', 'true')
    })

    it('拍手回数が表示される', () => {
      render(<WorkActions {...defaultProps} initialClaps={5} />)

      expect(screen.getByText('5')).toBeInTheDocument()
    })
  })

  describe('スキ操作', () => {
    it('スキボタンをクリックすると onLike が呼び出される', async () => {
      const user = userEvent.setup()
      const onLike = vi.fn().mockResolvedValue({ success: true })
      render(<WorkActions {...defaultProps} onLike={onLike} />)

      await user.click(screen.getByRole('button', { name: /スキ/i }))

      expect(onLike).toHaveBeenCalledWith({ liked: true })
    })

    it('スキ済みの状態でクリックすると onLike(false) が呼び出される', async () => {
      const user = userEvent.setup()
      const onLike = vi.fn().mockResolvedValue({ success: true })
      render(<WorkActions {...defaultProps} onLike={onLike} initialLiked={true} />)

      await user.click(screen.getByRole('button', { name: /スキ/i }))

      expect(onLike).toHaveBeenCalledWith({ liked: false })
    })
  })

  describe('拍手操作', () => {
    it('拍手ボタンをクリックすると onClap が呼び出される', async () => {
      const user = userEvent.setup()
      const onClap = vi.fn().mockResolvedValue({ success: true, newClaps: 1 })
      render(<WorkActions {...defaultProps} onClap={onClap} />)

      await user.click(screen.getByRole('button', { name: /拍手/i }))

      expect(onClap).toHaveBeenCalledWith({ count: 1 })
    })

    it('拍手すると回数が増加して表示される', async () => {
      const user = userEvent.setup()
      const onClap = vi.fn().mockResolvedValue({ success: true, newClaps: 6 })
      render(<WorkActions {...defaultProps} onClap={onClap} initialClaps={5} />)

      await user.click(screen.getByRole('button', { name: /拍手/i }))

      expect(await screen.findByText('6')).toBeInTheDocument()
    })
  })

  describe('ポイント消費表示', () => {
    it('拍手に必要なポイント数が表示される', () => {
      render(<WorkActions {...defaultProps} clapCost={10} />)

      expect(screen.getByText(/10.*pt/i)).toBeInTheDocument()
    })

    it('ポイント不足時は拍手ボタンが無効化される', () => {
      render(<WorkActions {...defaultProps} clapCost={10} availablePoints={5} />)

      const clapButton = screen.getByRole('button', { name: /拍手/i })
      expect(clapButton).toBeDisabled()
    })

    it('ポイント不足の警告メッセージが表示される', () => {
      render(<WorkActions {...defaultProps} clapCost={10} availablePoints={5} />)

      expect(screen.getByText(/ポイント不足/i)).toBeInTheDocument()
    })
  })

  describe('ローディング状態', () => {
    it('スキ処理中はボタンが無効化される', async () => {
      const user = userEvent.setup()
      const onLike = vi.fn().mockImplementation(() => new Promise(() => {})) // Never resolves
      render(<WorkActions {...defaultProps} onLike={onLike} />)

      await user.click(screen.getByRole('button', { name: /スキ/i }))

      expect(screen.getByRole('button', { name: /スキ/i })).toBeDisabled()
    })

    it('拍手処理中はボタンが無効化される', async () => {
      const user = userEvent.setup()
      const onClap = vi.fn().mockImplementation(() => new Promise(() => {}))
      render(<WorkActions {...defaultProps} onClap={onClap} />)

      await user.click(screen.getByRole('button', { name: /拍手/i }))

      expect(screen.getByRole('button', { name: /拍手/i })).toBeDisabled()
    })
  })

  describe('無効状態', () => {
    it('disabled=true の場合、両方のボタンが無効化される', () => {
      render(<WorkActions {...defaultProps} disabled />)

      expect(screen.getByRole('button', { name: /スキ/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /拍手/i })).toBeDisabled()
    })
  })
})

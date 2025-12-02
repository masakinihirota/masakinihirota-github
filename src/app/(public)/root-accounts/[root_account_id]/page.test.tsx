/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PublicRootAccountPage from './page'

// next/link をモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockParams = {
  root_account_id: 'test-root-account-123',
}

describe('PublicRootAccountPage', () => {
  it('公開ルートアカウント情報が表示される', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('公開ルートアカウント')).toBeInTheDocument()
  })

  it('基本情報が表示される', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('基本情報')).toBeInTheDocument()
  })

  it('プロフィール一覧が表示される', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('公開プロフィール')).toBeInTheDocument()
  })

  it('実績セクションが表示される', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('実績・バッジ')).toBeInTheDocument()
  })
})

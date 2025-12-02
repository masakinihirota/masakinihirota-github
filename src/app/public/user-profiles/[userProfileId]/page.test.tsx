/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PublicProfilePage from './page'

// next/link をモック
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// propsのモック
const mockParams = {
  userProfileId: 'test-profile-123',
}

describe('PublicProfilePage', () => {
  it('プロフィール情報が表示される', async () => {
    const page = await PublicProfilePage({ params: Promise.resolve(mockParams) })
    render(page)

    // モックデータに基づいた表示の確認
    expect(screen.getByText('公開プロフィール')).toBeInTheDocument()
  })

  it('スキルセクションが表示される', async () => {
    const page = await PublicProfilePage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('スキル・専門分野')).toBeInTheDocument()
  })

  it('作品セクションが表示される', async () => {
    const page = await PublicProfilePage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('作品・実績')).toBeInTheDocument()
  })

  it('所属情報セクションが表示される', async () => {
    const page = await PublicProfilePage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('所属')).toBeInTheDocument()
  })
})

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PublicRootAccountPage from './page'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

const mockParams = {
  root_account_id: 'test-root-account-123',
}

describe('PublicRootAccountPage', () => {
  it('公開ルートアカウントが表示される', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    expect(screen.getByText('公開ルートアカウント')).toBeInTheDocument()
  })

  it('公開プロフィールリンクが profile に向かう', async () => {
    const page = await PublicRootAccountPage({ params: Promise.resolve(mockParams) })
    render(page)

    // プロフィールリンクの href が /public/user-profiles/<id> になっているか
    expect(screen.getAllByRole('link')[1]).toHaveAttribute('href', '/public/user-profiles/profile-1')
  })
})

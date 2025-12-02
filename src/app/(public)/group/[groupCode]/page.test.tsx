/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import GroupPage from './page'

// Mock getOrganizationByGroupCode
vi.mock('@/lib/organization/getOrganizationByGroupCode', () => ({
  getOrganizationByGroupCode: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND')
  }),
}))

import { getOrganizationByGroupCode } from '@/lib/organization/getOrganizationByGroupCode'

describe('GroupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('グループコードから組織情報を表示する', async () => {
    const mockOrg = {
      id: 'org-123',
      name: 'テスト組織',
      description: 'テスト用の組織です',
      createdAt: new Date('2024-01-01'),
    }

    vi.mocked(getOrganizationByGroupCode).mockResolvedValue(mockOrg)

    const page = await GroupPage({ params: Promise.resolve({ groupCode: 'org-123' }) })
    render(page)

    expect(screen.getByText('テスト組織')).toBeInTheDocument()
    expect(screen.getByText('テスト用の組織です')).toBeInTheDocument()
  })

  it('組織が見つからない場合はnotFoundを返す', async () => {
    vi.mocked(getOrganizationByGroupCode).mockResolvedValue(null)

    await expect(
      GroupPage({ params: Promise.resolve({ groupCode: 'non-existent' }) })
    ).rejects.toThrow('NEXT_NOT_FOUND')
  })
})

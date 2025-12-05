import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Drizzle DB
vi.mock('@/lib/db', () => ({
  db: {
    query: {
      organizations: {
        findFirst: vi.fn(),
      },
    },
  },
}))

import { db } from '@/lib/db'
import { getOrganizationByGroupCode } from './getOrganizationByGroupCode'

describe('getOrganizationByGroupCode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return organization when id exists', async () => {
    const mockOrg = {
      id: 'org-123',
      name: 'テスト組織',
      description: 'テストの説明',
    }

    vi.mocked(db.query.organizations.findFirst).mockResolvedValue(mockOrg)

    const result = await getOrganizationByGroupCode('org-123')

    expect(result).toEqual(mockOrg)
    expect(db.query.organizations.findFirst).toHaveBeenCalled()
  })

  it('should return null when id does not exist', async () => {
    vi.mocked(db.query.organizations.findFirst).mockResolvedValue(undefined)

    const result = await getOrganizationByGroupCode('non-existent')

    expect(result).toBeNull()
  })

  it('should return null for empty groupCode', async () => {
    const result = await getOrganizationByGroupCode('')

    expect(result).toBeNull()
    expect(db.query.organizations.findFirst).not.toHaveBeenCalled()
  })
})

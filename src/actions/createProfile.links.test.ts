import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// Prepare a mocked DB — this test focuses on which table object is passed to db.insert
const { select: selectMock, insert: insertMock } = setupDbMock({
  select: () => ({ from: vi.fn(() => ({ where: vi.fn() })) }),
  insert: () => ({ values: vi.fn(() => ({ returning: vi.fn() })) }),
})

import * as actionModule from './createProfile.fetch'
import { db } from '@/lib/db'
import { profileLinks } from '@/db/schema'

describe('createProfile link persistence', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses profileLinks table when inserting links', async () => {
    // Arrange: root belongs to owner
    const whereMockRoot = vi.fn().mockResolvedValue([{ id: 'r1', userId: 'owner-1' }])
    ;(db.select as any).mockReturnValue({ from: () => ({ where: whereMockRoot }) })

    // Make profile insert return a profile id
    const insertMock = vi.fn()
    insertMock.mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'profile-links-test' }]) })
    ;(db.insert as any).mockImplementation((t: any) => ({ values: insertMock }))

    const payload = { rootAccountId: 'r1', name: 'Links Profile', role: 'member', type: 'self', links: [{ label: 'site', url: 'https://example.com' }] }
    const ctx = { session: { user: { id: 'owner-1' } } }

    // Act
    const res = await actionModule.createProfile(payload as any, ctx as any)

    // Assert the server action succeeded
    expect(res).toHaveProperty('success', true)

    const calls = (db.insert as any).mock.calls
    // Failing expectation (RED): expect one of the insert calls used the profileLinks table
    const usedProfileLinks = calls.some((c: any) => c[0] === profileLinks)

    // This should fail until createProfile actually uses profileLinks
    expect(usedProfileLinks).toBe(true)
  })
})

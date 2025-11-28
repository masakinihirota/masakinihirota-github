import { describe, it, expect, vi, beforeEach } from 'vitest'

// We'll test the createProfile server action in isolation by mocking the db module.
import * as actionModule from './createProfile.fetch'

vi.mock('@/lib/db', () => ({
  db: {
    select: vi.fn(() => ({ from: vi.fn(() => ({ where: vi.fn() })) })),
    insert: vi.fn(() => ({ values: vi.fn(() => ({ returning: vi.fn() })) })),
    delete: vi.fn(),
  },
}))

import { db } from '@/lib/db'
import { profiles, organizations, rootAccounts } from '@/db/schema'

describe('createProfile (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws UnauthorizedError when context is missing', async () => {
    const payload = { rootAccountId: 'r1', name: 'Alice' }
    await expect(actionModule.createProfile(payload, undefined as any)).rejects.toMatchObject({ code: 401 })
  })

  it('throws Forbidden when rootAccount belongs to different user', async () => {
    // mock db.select().from(...).where -> resolves to a root with userId 'other'
    const whereMock = vi.fn().mockResolvedValue([{ id: 'r1', userId: 'other' }])
    ;(db.select as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const payload = { rootAccountId: 'r1', name: 'Alice' }
    const ctx = { session: { user: { id: 'user-123' } } }

    await expect(actionModule.createProfile(payload as any, ctx as any)).rejects.toMatchObject({ code: 403 })
  })

  it('creates profile successfully (member) and returns profileId', async () => {
    // rootAccount belongs to user
    const whereMock = vi.fn().mockResolvedValue([{ id: 'r1', userId: 'user-123' }])
    ;(db.select as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    // mock insert for profiles -> returning a generated profile id
    const insertMock = vi.fn()
    insertMock.mockReturnValue({ returning: vi.fn().mockResolvedValue([{ id: 'profile-1' }]) })
    ;(db.insert as any).mockImplementation((t: any) => ({ values: insertMock }))

    const payload = { rootAccountId: 'r1', name: 'Member Profile', role: 'member', type: 'self' }
    const ctx = { session: { user: { id: 'user-123' } } }

    const res = await actionModule.createProfile(payload as any, ctx as any)

    expect(res).toHaveProperty('success', true)
    expect(res).toHaveProperty('profileId', 'profile-1')
    expect(res).toHaveProperty('organizationId', null)
  })

  it('creates profile and organization when role=leader', async () => {
    const whereMock = vi.fn().mockResolvedValue([{ id: 'r1', userId: 'owner-1' }])
    ;(db.select as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    // First insert (profiles) -> profile id
    let call = 0
    ;(db.insert as any).mockImplementation((t: any) => ({
      values: () => ({
        returning: async () => {
          call += 1
          if (call === 1) return [{ id: 'p-leader' }]
          // second insert is organization
          if (call === 2) return [{ id: 'org-1' }]
          return []
        },
      }),
    }))

    const payload = { rootAccountId: 'r1', name: 'Leader', role: 'leader', type: 'self' }
    const ctx = { session: { user: { id: 'owner-1' } } }

    const res = await actionModule.createProfile(payload as any, ctx as any)

    expect(res).toHaveProperty('success', true)
    expect(res).toHaveProperty('profileId', 'p-leader')
    expect(res).toHaveProperty('organizationId', 'org-1')
  })
})
import { describe, it, expect } from 'vitest'

// RED phase tests for createProfile Server Action
// These tests expect the Server Action to enforce validation and authentication.

describe('createProfile (Server Action) - RED tests', () => {
  it('throws ValidationError when name is empty', async () => {
    // Arrange
    // NOTE: createProfile implementation will be added later (GREEN). Import now to drive RED.
    const { createProfile } = await import('@/actions/createProfile.fetch')

    // Act + Assert
    await expect(
      // minimal payload with empty name
      createProfile({ rootAccountId: 'root_1', name: '', role: 'member', type: 'self' })
    ).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })

  it('throws UnauthorizedError when called by an unauthenticated user', async () => {
    const { createProfile } = await import('@/actions/createProfile.fetch')

    // Simulate unauthenticated call - implementation should check session/context
    await expect(
      createProfile({ rootAccountId: 'root_1', name: 'Alice', role: 'member', type: 'self' }, { session: undefined })
    ).rejects.toMatchObject({ code: 401, name: 'UnauthorizedError' })
  })
})

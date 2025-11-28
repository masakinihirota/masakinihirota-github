import { describe, it, expect } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// Arrange DB mocks before importing the module under test
setupDbMock({ insert: () => ({ values: () => ({ returning: () => [] }) }) })

describe('createInvitation (Server Action) - RED', () => {
  it('creates an invitation with default expiry when expiresAt not provided', async () => {
    const { createInvitation } = await import('@/actions/createInvitation.fetch')

    const res = await createInvitation({ nationId: 'n1', organizationId: 'org-1' } as any)

    // We expect the result to include an expiresAt set into the future (default TTL)
    expect(res).toHaveProperty('expiresAt')
    const expires = new Date(res.expiresAt).getTime()
    expect(expires).toBeGreaterThan(Date.now() + 1000 * 60 * 60 * 24 * 6) // > 6 days from now
  })

  it('returns a token (uuid) when creating an invitation without token provided', async () => {
    const { createInvitation } = await import('@/actions/createInvitation.fetch')
    const res = await createInvitation({ nationId: 'n1', organizationId: 'org-1' } as any)
    expect(res).toHaveProperty('token')
    // basic uuid v4 pattern check
    expect(typeof res.token).toBe('string')
    expect(res.token).toMatch(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/)
  })
})

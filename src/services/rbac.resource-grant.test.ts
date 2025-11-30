import { describe, it, expect } from 'vitest'
import setupDbMock from '@/tests/setup/mockDb'

describe('RbacService (resource-scoped allow)', () => {
  it('resource-scoped allow should grant permission when checking with organization context (RED)', async () => {
    const perm = 'perm.org.specific'
    const orgId = 'org-123'

    let call = 0
    setupDbMock({
      select: () => ({
        from: () => ({
          where: async () => {
            call += 1
            if (call === 1) return [{ id: 'root-1' }]
            if (call === 2) return [{ id: 'profile-1' }]

            // global exceptions lookup -> no global exceptions
            if (call === 3) return []

            // resource-scoped exceptions lookup for organization -> return allow
            if (call === 4) return [{ id: 'ex-1', profileId: 'profile-1', permissionId: perm, isDeny: false, resourceType: 'organization', resourceId: orgId }]

            // other selects (roles lookup, etc) -> empty
            return []
          }
        })
      })
    })

    // Import service after mock prepared
    const { rbacService } = await import('./rbac.service')

    // Current implementation does not look up resource-scoped exceptions for organization
    // so even if an organization-scoped allow was present in DB, it won't be considered.
    // Expectation (RED): we want hasPermission to be true here (because an organization-scoped allow should grant),
    // but current behavior should return false — so the test should fail.
    const result = await rbacService.hasPermission('user-1', perm as any, { organizationId: orgId })
    expect(result).toBe(true)
  })
})

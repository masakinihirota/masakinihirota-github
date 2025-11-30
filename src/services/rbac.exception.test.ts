import { describe, it, expect } from 'vitest'
import setupDbMock from '@/tests/setup/mockDb'

describe('RbacService (exception expiry)', () => {
  it('expired exception grants should be ignored (RED)', async () => {
    // Arrange: set up db mock to return rootAccount -> profile -> expired exception
    const localPermId = 'perm.test.expiry';

    let call = 0
    const { select } = setupDbMock({
      select: () => ({
        from: () => ({
          where: async () => {
            call += 1
            if (call === 1) return [{ id: 'root-1' }]; // rootAccounts
            if (call === 2) return [{ id: 'profile-1' }]; // profiles

            // Return an expired allow exception for the profile
            if (call === 3) return [{ id: 'ex-1', profileId: 'profile-1', permissionId: localPermId, isDeny: false, resourceType: null, resourceId: null, expiresAt: '2020-01-01T00:00:00Z' }]

            return []
          }
        })
      })
    })

    // Import service after mock is prepared
    const { rbacService } = await import('./rbac.service')

    const result = await rbacService.hasPermission('user-1', localPermId as any)

    // Expectation (RED): expired exception should be ignored => result should be false
    // Current implementation doesn't check expiresAt, so this should FAIL until we implement logic.
    expect(result).toBe(false)
  })
})

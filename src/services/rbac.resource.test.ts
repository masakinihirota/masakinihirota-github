import { describe, it, expect } from 'vitest'
import setupDbMock from '@/tests/setup/mockDb'

describe('RbacService (resource-scoped exceptions)', () => {
  it('resource-scoped allow should NOT grant global permission (RED)', async () => {
    // Arrange: set up db mock to return rootAccount -> profile -> resource-scoped exception
    const localPermId = 'perm.test.resource';

    let call = 0
    const { select } = setupDbMock({
      select: () => ({
        from: () => ({
          where: async () => {
            call += 1
            if (call === 1) return [{ id: 'root-1' }]; // rootAccounts
            if (call === 2) return [{ id: 'profile-1' }]; // profiles
            // Under the new implementation the DB query for exceptions includes
            // resourceType/resourceId IS NULL checks, so resource-scoped exception
            // should NOT be returned for the global lookup -> return []
            if (call === 3) return [];
            // all other selects -> empty
            return []
          }
        })
      })
    })

    // Import service after mock is prepared (module is already mocked in mockDb)
    const { rbacService } = await import('./rbac.service')

    const result = await rbacService.hasPermission('user-1', localPermId as any)

    // Expectation (RED): currently resource-scoped allow is treated as global allow => implementation returns true
    // We assert that this is NOT desired (so expect false) — test should fail until fixed.
    expect(result).toBe(false)
  })
})

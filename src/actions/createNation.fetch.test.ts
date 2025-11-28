import { describe, it, expect, vi } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// Arrange DB mocks before importing the module under test
const { select: selectMock } = setupDbMock({
  select: () => ({ from: vi.fn(() => ({ where: vi.fn() })) }),
})

describe('createNation (Server Action) - RED', () => {
  it('rejects creation when root account has insufficient points', async () => {
    // Mock db.select(...).from(...).where(...) to return a low balance
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 10 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { createNation } = await import('@/actions/createNation.fetch')

    await expect(createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100 })).rejects.toMatchObject({ code: 402 })
  })

  it('inserts a point_transactions record when creation succeeds', async () => {
    // Provide sufficient balance so creation should be allowed
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 1000 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    // capture inserts
    const { createNation } = await import('@/actions/createNation.fetch')

    // call createNation - implementation should insert into point_transactions
    await createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100 })

    // insert mock should have been called at least once for recording point_transactions
    // Note: setupDbMock returns the mocked insert function as insertMock; we just assert it was called
    // import the mocked db insert via require to assert calls
    const db = await import('@/lib/db')
    expect((db.db.insert as any).mock.calls.length).toBeGreaterThanOrEqual(1)
  })

  it('decrements root_account_points balance when creation succeeds', async () => {
    // Provide sufficient balance so creation should be allowed
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 1000 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { createNation } = await import('@/actions/createNation.fetch')

    await createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100 })

    const db = await import('@/lib/db')
    // expect that execute was called to update balance
    expect((db.db.execute as any).mock.calls.length).toBeGreaterThanOrEqual(1)
  })

  it('assigns sovereign role to creating profile when creation succeeds', async () => {
    // Provide sufficient balance so creation should be allowed
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 1000 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { createNation } = await import('@/actions/createNation.fetch')

    // pass a creator profile id in payload
    await createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100, creatorProfileId: 'profile-1' } as any)

    const db = await import('@/lib/db')
    // Find whether an insert call used acl_nation_role_assignments as its first arg
    const calls = (db.db.insert as any).mock.calls
    // We expect at least one call where the first arg is the aclNationRoleAssignments table
    const { aclNationRoleAssignments } = await import('@/db/schema')
    const found = calls.some((c: any[]) => c[0] === aclNationRoleAssignments)
    expect(found).toBe(true)
  })

  it('creates a nations record when creation succeeds', async () => {
    // Provide sufficient balance so creation should be allowed
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 1000 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { createNation } = await import('@/actions/createNation.fetch')

    await createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100, creatorProfileId: 'profile-1' } as any)

    const db = await import('@/lib/db')
    const { nations } = await import('@/db/schema')

    const calls = (db.db.insert as any).mock.calls
    const found = calls.some((c: any[]) => c[0] === nations)
    expect(found).toBe(true)
  })

  it('rolls back all DB changes when role assignment fails (transactional)', async () => {
    // configure mocks: sufficient balance
    const whereMock = vi.fn().mockResolvedValue([{ root_account_id: 'root-1', balance: 1000 }])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    // set insert to throw when inserting into acl_nation_role_assignments
    const db = await import('@/lib/db')
    const { aclNationRoleAssignments } = await import('@/db/schema')

    // make insert behave normally for other tables, but throw on role assignment table
    ;(db.db.insert as any).mockImplementation((table: any) => {
      if (table === aclNationRoleAssignments) {
        throw new Error('db insert failed for acl_nation_role_assignments')
      }
      return { values: () => Promise.resolve() }
    })

    const { createNation } = await import('@/actions/createNation.fetch')

    await expect(createNation({ rootAccountId: 'root-1', name: 'My Nation', cost: 100, creatorProfileId: 'profile-1' } as any)).rejects.toThrow()

    // After failure we expect a rollback call to have been made
    expect((db.db.execute as any).mock.calls.some((c: any[]) => typeof c[0] === 'string' && /ROLLBACK/i.test(c[0]))).toBe(true)
  })
})

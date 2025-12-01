import { describe, it, expect, vi } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// set up db mocks before importing the module under test
const { select: selectMock } = setupDbMock({
  select: () => ({ from: vi.fn(() => ({ where: vi.fn() })) }),
})

describe('joinNation (Server Action) - RED', () => {
  it('rejects join requests when there is no invitation for the organization', async () => {
    // simulate db select returning no invitation rows
    const whereMock = vi.fn().mockResolvedValue([])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { joinNation } = await import('@/actions/joinNation.fetch')

    // attempt to join without an invitation
    await expect(joinNation({ nationId: 'n1', organizationId: 'org-1', requesterProfileId: 'p1' } as any)).rejects.toMatchObject({ code: 403 })
  })

  it('rejects join requests when the invitation exists but is expired', async () => {
    // setup select mock to return an expired invitation row
    const expired = { id: 'inv-1', nation_id: 'n1', organization_id: 'org-1', expires_at: '2000-01-01T00:00:00.000Z' }
    const whereMock = vi.fn().mockResolvedValue([expired])
    ;(selectMock as any).mockReturnValue({ from: () => ({ where: whereMock }) })

    const { joinNation } = await import('@/actions/joinNation.fetch')

    await expect(joinNation({ nationId: 'n1', organizationId: 'org-1', requesterProfileId: 'p1' } as any)).rejects.toMatchObject({ code: 403 })
  })
})

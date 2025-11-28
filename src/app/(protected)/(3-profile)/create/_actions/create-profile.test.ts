import { describe, it, expect } from 'vitest'

// RED tests for the App Router Server Action
describe('app/(protected)/(3-profile)/create/_actions/create-profile (RED)', () => {
  it('throws ValidationError when name is empty', async () => {
    const { createProfile } = await import('@/app/(protected)/(3-profile)/create/_actions/create-profile')

    await expect(
      createProfile({ rootAccountId: 'root_1', name: '', role: 'member', type: 'self' } as any)
    ).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })

  it('throws UnauthorizedError when session is missing', async () => {
    const { createProfile } = await import('@/app/(protected)/(3-profile)/create/_actions/create-profile')

    await expect(
      createProfile({ rootAccountId: 'root_1', name: 'Alice', role: 'member', type: 'self' }, undefined as any)
    ).rejects.toMatchObject({ code: 401, name: 'UnauthorizedError' })
  })
})

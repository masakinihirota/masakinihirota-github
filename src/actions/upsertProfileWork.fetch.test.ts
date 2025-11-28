import { describe, it, expect } from 'vitest'

describe('upsertProfileWork (Server Action) - RED tests', () => {
  it('throws ValidationError when profileId or workId missing', async () => {
    const { upsertProfileWork } = await import('@/actions/upsertProfileWork.fetch')

    await expect(
      upsertProfileWork({ profileId: '', workId: '' }, { session: { user: { id: 'u1' } } })
    ).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })

  it('throws UnauthorizedError when called by an unauthenticated user', async () => {
    const { upsertProfileWork } = await import('@/actions/upsertProfileWork.fetch')

    await expect(
      upsertProfileWork({ profileId: 'p1', workId: 'w1', tier: 2 }, { session: undefined })
    ).rejects.toMatchObject({ code: 401, name: 'UnauthorizedError' })
  })
})

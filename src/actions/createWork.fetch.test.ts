import { describe, it, expect } from 'vitest'

describe('createWork (Server Action) - RED tests', () => {
  it('throws ValidationError when title is empty', async () => {
    const { createWork } = await import('@/actions/createWork.fetch')

    await expect(
      // empty title — should be rejected
      createWork({ title: '', categoryId: 'novel' })
    ).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })

  it('throws UnauthorizedError when called by an unauthenticated user', async () => {
    const { createWork } = await import('@/actions/createWork.fetch')

    await expect(
      createWork({ title: 'A valid title', categoryId: 'novel' }, { session: undefined })
    ).rejects.toMatchObject({ code: 401, name: 'UnauthorizedError' })
  })
})

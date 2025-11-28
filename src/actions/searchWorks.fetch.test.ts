import { describe, it, expect } from 'vitest'

describe('searchWorks (Server Action) - RED tests', () => {
  it('throws ValidationError when query is empty', async () => {
    const { searchWorks } = await import('@/actions/searchWorks.fetch')

    await expect(searchWorks({ q: '' })).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })
})

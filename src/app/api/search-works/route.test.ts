import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/actions/searchWorks.fetch', () => ({
  searchWorks: vi.fn(async () => [{ id: 'w-1', title: 'Work 1' }]),
}))

import { POST } from './route'

describe('POST /api/search-works', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns search results when called with q', async () => {
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify({ q: 'Work' }) })
    const res = await POST(req)
    const json = await res.json()

    expect(json).toHaveProperty('success', true)
    expect(json.data).toBeInstanceOf(Array)
    expect(json.data[0]).toMatchObject({ id: 'w-1', title: 'Work 1' })
  })
})

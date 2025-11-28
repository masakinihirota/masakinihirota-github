import { describe, it, expect, vi } from 'vitest'
import { setupDbMock } from '@/tests/setup/mockDb'

// Use shared helper to mock DB before importing implementation
setupDbMock({ execute: async () => [] })

describe('searchWorks (Server Action) - RED tests', () => {
  it('throws ValidationError when query is empty', async () => {
    // import after mocking to avoid connecting to a real DB during test import
    const { searchWorks } = await import('@/actions/searchWorks.fetch')

    await expect(searchWorks({ q: '' })).rejects.toMatchObject({ code: 400, name: 'ValidationError' })
  })
})

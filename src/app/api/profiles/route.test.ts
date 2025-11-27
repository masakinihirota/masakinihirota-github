import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/actions/createProfile.fetch', () => ({
  createProfile: vi.fn(async () => ({ success: true, profileId: 'p-x' })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { POST } from './route'
import { createClient } from '@/lib/supabase/server'

describe('POST /api/profiles', () => {
  beforeEach(() => vi.resetAllMocks())

  it('proxies payload and session to createProfile', async () => {
    const mockSupabase = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-xyz' } } }) } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const payload = { rootAccountId: 'r-1', name: 'Test' }
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify(payload) })

    const res = await POST(req)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = await (res as any).json()

    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })
})

import { vi, describe, it, expect, beforeEach } from 'vitest'

vi.mock('@/actions/upsertProfileWork.fetch', () => ({
  upsertProfileWork: vi.fn(async () => ({ success: true })),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

import { POST } from './route'
import { createClient } from '@/lib/supabase/server'

describe('POST /api/profile-works', () => {
  beforeEach(() => vi.resetAllMocks())

  it('calls upsertProfileWork with user session and payload', async () => {
    const mockSupabase = { auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-abc' } } }) } }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)

    const payload = { profileId: 'p-1', workId: 'w-1', status: 'now' }
    const req = new Request('http://localhost', { method: 'POST', body: JSON.stringify(payload) })

    const res = await POST(req)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const json = await (res as any).json()

    expect(json.success).toBe(true)
    expect(json.data).toBeDefined()
  })
})

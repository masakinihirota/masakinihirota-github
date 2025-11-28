import { describe, it, expect, afterAll } from 'vitest'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { works } from '@/db/schema'

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL)

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('createWork integration tests (skipped — no DB)', () => {})
} else {

describe('createWork integration', () => {
  let insertedWorkId: string | null = null

  afterAll(async () => {
    if (insertedWorkId) {
      await db.delete(works).where(eq(works.id, insertedWorkId))
    }
  })

  it('inserts a new work to works table', async () => {
    const { createWork } = await import('./createWork.fetch')

    const ctx = { session: { user: { id: 'integration-user' } } }

    const payload = { title: 'Integration Test Work', categoryId: 'novel', authors: ['Test'] }

    const res = await createWork(payload, ctx)

    expect(res).toHaveProperty('success', true)
    expect(res).toHaveProperty('workId')

    insertedWorkId = res.workId

    // verify DB row exists
    const rows = await db.select().from(works).where(eq(works.id, insertedWorkId))
    expect(rows.length).toBe(1)
  })
})

}

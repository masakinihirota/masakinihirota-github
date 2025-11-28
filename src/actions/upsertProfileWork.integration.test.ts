import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { users, rootAccounts, profiles, works, profileWorks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL)

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('upsertProfileWork integration tests (skipped — no DB)', () => {})
} else {

describe('upsertProfileWork integration', () => {
  let userId: string
  let rootAccountId: string
  let profileId: string
  let workId: string

  beforeAll(async () => {
    userId = randomUUID()
    await db.insert(users).values({ id: userId, email: `test+${userId}@example.com` }).returning()
    const insertedRoot = await db.insert(rootAccounts).values({ userId, displayName: 'integration-root' }).returning()
    rootAccountId = insertedRoot[0].id
    const insertedProfile = await db.insert(profiles).values({ rootAccountId, name: 'integration-profile' }).returning()
    profileId = insertedProfile[0].id

    const insertedWork = await db.insert(works).values({ title: 'Temp Work', categoryId: 'other', approved: true }).returning()
    workId = insertedWork[0].id
  })

  afterAll(async () => {
    // cleanup
    await db.delete(profileWorks).where(eq(profileWorks.profileId, profileId))
    await db.delete(works).where(eq(works.id, workId))
    await db.delete(profiles).where(eq(profiles.id, profileId))
    await db.delete(rootAccounts).where(eq(rootAccounts.id, rootAccountId))
    await db.delete(users).where(eq(users.id, userId))
  })

  it('creates a profile_works row when rating a work', async () => {
    const { upsertProfileWork } = await import('./upsertProfileWork.fetch')

    const ctx = { session: { user: { id: userId } } }

    const payload = { profileId, workId, status: 'now', tier: 2, claps: 1, liked: true }

    const res = await upsertProfileWork(payload, ctx)
    expect(res).toMatchObject({ success: true })

    const rows = await db.select().from(profileWorks).where(eq(profileWorks.profileId, profileId))
    const match = rows.find((r) => r.workId === workId)
    expect(match).toBeDefined()
    expect(match?.tier).toBe(2)
    expect(match?.liked).toBe(true)
  })
})

}

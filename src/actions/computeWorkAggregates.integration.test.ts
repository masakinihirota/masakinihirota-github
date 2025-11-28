import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { users, rootAccounts, profiles, works, profileWorks, workAggregates, workCategories } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL)

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('computeWorkAggregates integration tests (skipped — no DB)', () => {})
} else {

describe('computeWorkAggregates integration', () => {
  let userId: string
  let rootAccountId: string
  let profileId: string | null = null
  let workId: string | null = null

  beforeAll(async () => {
    // seed work category
    await db.insert(workCategories).values({ id: 'novel', name: 'Novel' }).onConflictDoNothing()

    userId = randomUUID()
    await db.insert(users).values({ id: userId, email: `test+${userId}@example.com` })
    const [root] = await db.insert(rootAccounts).values({ userId, displayName: 'agg user' }).returning()
    rootAccountId = root.id

    // create profile for user
    const [p] = await db.insert(profiles).values({ rootAccountId, name: 'Agg Profile' }).returning()
    profileId = p.id

    // create work
    const [w] = await db.insert(works).values({ title: 'Aggregate Work', categoryId: 'novel', approved: true, createdBy: rootAccountId }).returning()
    workId = w.id

    // insert profile_works
    await db.insert(profileWorks).values([
      { profileId, workId, tier: 1, claps: 2, liked: true },
      { profileId, workId, tier: 2, claps: 1, liked: false },
    ])
  })

  afterAll(async () => {
    if (workId) await db.delete(works).where(eq(works.id, workId))
    if (profileId) await db.delete(profiles).where(eq(profiles.id, profileId))
    if (rootAccountId) await db.delete(rootAccounts).where(eq(rootAccounts.id, rootAccountId))
    if (userId) await db.delete(users).where(eq(users.id, userId))
    // cleanup aggregates
    if (workId) await db.delete(workAggregates).where(eq(workAggregates.workId, workId))
  })

  it('computes aggregates and upserts into work_aggregates', async () => {
    const { computeWorkAggregates } = await import('./computeWorkAggregates.fetch')

    const res = await computeWorkAggregates()

    expect(res.success).toBe(true)
    expect(res.processed).toBeGreaterThanOrEqual(1)

    // verify aggregate row exists for our work
    const rows = await db.select().from(workAggregates).where(eq(workAggregates.workId, workId!))
    expect(rows.length).toBe(1)
    const agg = rows[0]
    expect(Number(agg.totalRatings)).toBeGreaterThanOrEqual(1)
  })
})

}

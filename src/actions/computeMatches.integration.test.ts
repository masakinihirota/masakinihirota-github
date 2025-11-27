import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { users, rootAccounts, profiles, works, profileWorks } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL)

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('computeMatches integration tests (skipped — no DB)', () => {})
} else {

describe('computeMatches integration', () => {
  let userId: string
  let rootAccountId: string
  let profile1: string | null = null
  let profile2: string | null = null
  let workA: string | null = null
  let workB: string | null = null

  beforeAll(async () => {
    userId = randomUUID()
    await db.insert(users).values({ id: userId, email: `match+${userId}@example.com` })
    const [root] = await db.insert(rootAccounts).values({ userId, displayName: 'match user' }).returning()
    rootAccountId = root.id

    // create profiles
    const [p1] = await db.insert(profiles).values({ rootAccountId, name: 'P1' }).returning()
    profile1 = p1.id
    const [p2] = await db.insert(profiles).values({ rootAccountId, name: 'P2' }).returning()
    profile2 = p2.id

    // create works
    const [wA] = await db.insert(works).values({ title: 'Work A', categoryId: 'novel', approved: true, createdBy: rootAccountId }).returning()
    workA = wA.id
    const [wB] = await db.insert(works).values({ title: 'Work B', categoryId: 'novel', approved: true, createdBy: rootAccountId }).returning()
    workB = wB.id

    // add profile works: both profiles share workA; p1 also has workB
    await db.insert(profileWorks).values([
      { profileId: profile1, workId: workA, tier: 1, claps: 0, liked: true },
      { profileId: profile1, workId: workB, tier: 2, claps: 1, liked: false },
      { profileId: profile2, workId: workA, tier: 2, claps: 0, liked: false },
    ])
  })

  afterAll(async () => {
    if (workA) await db.delete(works).where(eq(works.id, workA))
    if (workB) await db.delete(works).where(eq(works.id, workB))
    if (profile1) await db.delete(profiles).where(eq(profiles.id, profile1))
    if (profile2) await db.delete(profiles).where(eq(profiles.id, profile2))
    if (rootAccountId) await db.delete(rootAccounts).where(eq(rootAccounts.id, rootAccountId))
    if (userId) await db.delete(users).where(eq(users.id, userId))
    // cleanup profile_works
    if (profile1) await db.delete(profileWorks).where(eq(profileWorks.profileId, profile1))
    if (profile2) await db.delete(profileWorks).where(eq(profileWorks.profileId, profile2))
  })

  it('computes matches and returns profile 2 as a match for profile 1', async () => {
    const { computeMatches } = await import('./computeMatches.fetch')
    const res = await computeMatches(profile1!)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const found = res.some((r: any) => r.profileId === profile2)
    expect(found).toBe(true)
  })

})

}

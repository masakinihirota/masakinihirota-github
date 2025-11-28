import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { db } from '@/lib/db'
import { users, rootAccounts, profiles, organizations, organizationMembers, organizationRoles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL)

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('createProfile integration tests (skipped — no DB)', () => {})
} else {

describe('createProfile integration (leader -> auto-create organization)', () => {
  let userId: string
  let rootAccountId: string

  beforeAll(async () => {
    // Ensure master data exists for organization roles
    await db.insert(organizationRoles).values([
      { id: 'leader', name: 'Leader' },
      { id: 'member', name: 'Member' },
    ]).onConflictDoNothing()

    userId = randomUUID()
    // insert user
    await db.insert(users).values({ id: userId, email: `test+${userId}@example.com` }).returning()

    // insert root account linked to user
    const [root] = await db.insert(rootAccounts).values({ userId, displayName: 'root user' }).returning()
    rootAccountId = root.id
  })

  afterAll(async () => {
    // delete root account and user cleanup
    await db.delete(rootAccounts).where(eq(rootAccounts.id, rootAccountId))
    await db.delete(users).where(eq(users.id, userId))
  })

  it('creates profile and automatically creates organization + member when role=leader', async () => {
    const { createProfile } = await import('./createProfile.fetch')

    const ctx = { session: { user: { id: userId } } }

    const payload = { rootAccountId, name: 'Leader Profile', role: 'leader', type: 'self' }

    const result = await createProfile(payload, ctx)

    // Expect success and profileId in result
    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('profileId')
    const profileId = result.profileId

    // Check profile exists in DB
    const insertedProfiles = await db.select().from(profiles).where(eq(profiles.id, profileId))
    expect(insertedProfiles.length).toBe(1)

    // Check organization exists with leaderProfileId = profileId
    const orgs = await db.select().from(organizations).where(eq(organizations.leaderProfileId, profileId))
    expect(orgs.length).toBeGreaterThan(0)

    const orgId = orgs[0].id

    // Check organization_members includes profileId with role 'leader'
    const members = await db.select().from(organizationMembers).where(eq(organizationMembers.organizationId, orgId)) as Array<{ profileId: string; roleId: string }>
    const member = members.find((m) => m.profileId === profileId)
    expect(member).toBeDefined()
    expect(member?.roleId).toBe('leader')

    // cleanup created rows
    await db.delete(organizationMembers).where(eq(organizationMembers.organizationId, orgId))
    await db.delete(organizations).where(eq(organizations.id, orgId))
    await db.delete(profiles).where(eq(profiles.id, profileId))
  })

  it('creates profile and persists provided links in profile_links', async () => {
    const { createProfile } = await import('./createProfile.fetch')

    const ctx = { session: { user: { id: userId } } }

    const payload = { rootAccountId, name: 'Links Integration', role: 'member', type: 'self', links: [{ label: 'site', url: 'https://example.com' }, { label: 'blog', url: 'https://blog.example.com' }] }

    const result = await createProfile(payload as any, ctx as any)

    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('profileId')
    const profileId = result.profileId

    // Check profile_links contains inserted rows
    const rows = await db.select().from((await import('@/db/schema')).profileLinks).where(eq((await import('@/db/schema')).profileLinks.profileId, profileId))
    expect(rows.length).toBeGreaterThanOrEqual(2)

    // cleanup: remove profile_links and profile
    await db.delete((await import('@/db/schema')).profileLinks).where(eq((await import('@/db/schema')).profileLinks.profileId, profileId))
    await db.delete(profiles).where(eq(profiles.id, profileId))
  })
})

}

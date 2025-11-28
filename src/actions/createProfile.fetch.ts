/**
 * Minimal createProfile Server Action implementation (GREEN step).
 * - Validates payload first (ValidationError)
 * - Checks authentication next (UnauthorizedError)
 * - Returns a minimal success payload when valid
 */
import { db } from '@/lib/db'
import { profiles, organizations, organizationMembers, rootAccounts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { normalizeAndValidateProfile, type CreateProfilePayload } from '@/lib/profile/createProfile.logic'

export async function createProfile(
  payload: CreateProfilePayload & { role?: string; type?: string },
  ctx?: { session?: { user?: { id: string } } } | null
) {
  // Validation first using logic layer
  const validated = normalizeAndValidateProfile(payload)

  // Authentication check
  if (!ctx?.session || !ctx.session.user) {
    throw { code: 401, name: 'UnauthorizedError', message: 'unauthenticated' }
  }

  // Authorization: ensure rootAccount belongs to user
  const [root] = await db.select().from(rootAccounts).where(eq(rootAccounts.id, validated.rootAccountId))
  if (!root || root.userId !== ctx.session.user.id) {
    throw { code: 403, name: 'Forbidden', message: 'not allowed to create profile for this root account' }
  }

  // Insert profile
  const inserted = await db.insert(profiles).values({ rootAccountId: validated.rootAccountId, name: validated.name }).returning()
  const profileId = inserted[0].id

  let createdOrgId: string | null = null
  // If leader, create organization and membership
  if (validated.role === 'leader') {
    const orgs = await db.insert(organizations).values({ name: `${validated.name}'s Organization`, leaderProfileId: profileId }).returning()
    createdOrgId = orgs[0].id
    // Add as organization member with role 'leader'
    await db.insert(organizationMembers).values({ organizationId: createdOrgId, profileId, roleId: 'leader' })
  }

  return { success: true, profileId, organizationId: createdOrgId }
}

export default createProfile

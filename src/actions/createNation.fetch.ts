/**
 * Minimal stub for createNation Server Action (RED first)
 * Will be implemented to validate points and create a nation.
 */
import { db } from '@/lib/db'
import { rootAccountPoints, pointTransactions, aclNationRoleAssignments, nations } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { canCreateNation } from '@/lib/nation/create.logic'

export async function createNation(payload: { rootAccountId: string; name: string; cost: number; creatorProfileId?: string }, ctx?: any) {
  // Read current points from db
  const res = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, payload.rootAccountId))
  const row = Array.isArray(res) && res.length > 0 ? res[0] : null
  const balance = row?.balance ?? 0

  const outcome = canCreateNation({ rootAccountPoints: balance, cost: payload.cost })
  if (!outcome.success) {
    throw { code: 402, name: 'InsufficientPoints', message: outcome.reason ?? 'insufficient points' }
  }

  // Transactional behavior (BEGIN / COMMIT / ROLLBACK)
  await db.execute('BEGIN')
  try {
    // Create nations record (minimal)
    const inserted = await db.insert(nations).values({ name: payload.name, description: null, leaderOrganizationId: null, levelId: 'Village' }).returning()
    const newNationId = Array.isArray(inserted) && inserted.length > 0 ? inserted[0].id : 'nation-1'

    // Record point transaction
    await db.insert(pointTransactions).values({ rootAccountId: payload.rootAccountId, delta: -payload.cost, reason: 'FOUND_NATION', relatedEntity: 'nation', relatedId: newNationId })

    // Decrement the stored balance in root_account_points (minimal update)
    await db.execute('UPDATE root_account_points SET balance = balance - $1 WHERE root_account_id = $2', [payload.cost, payload.rootAccountId])

    // If a creating profile is provided, assign sovereign role
    if ((payload as any).creatorProfileId) {
      await db.insert(aclNationRoleAssignments).values({ nationId: newNationId, profileId: (payload as any).creatorProfileId, roleId: 'sovereign' })
    }

    await db.execute('COMMIT')
  } catch (err) {
    await db.execute('ROLLBACK')
    throw err
  }

  // minimal successful response for GREEN
  return { success: true, nationId: newNationId }
}

export default createNation

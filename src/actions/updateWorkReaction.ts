/**
 * Server Action for updating work reactions (like/clap)
 * - Like: toggle liked status (no point cost)
 * - Clap: increment claps count (consumes points)
 */
'use server'

import { db } from '@/lib/db'
import { profileWorks, rootAccountPoints, pointTransactions, rootAccounts, profiles } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { createClient } from '@/lib/supabase/server'

export type UpdateWorkReactionInput = {
  profileId: string
  workId: string
  action: 'like' | 'clap'
  clapPointCost?: number // default 1
}

export type UpdateWorkReactionResult = {
  success: boolean
  liked?: boolean
  claps?: number
  pointsRemaining?: number
}

/**
 * Update work reaction (like/clap)
 * @param input - The input containing profileId, workId, and action
 * @returns Result with updated state
 */
export async function updateWorkReaction(
  input: UpdateWorkReactionInput
): Promise<UpdateWorkReactionResult> {
  // Authentication check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const { profileId, workId, action, clapPointCost = 1 } = input

  // Validation
  if (!profileId || !workId) {
    throw new Error('profileId and workId are required')
  }

  // Get the profile's root account for point operations
  const profileRows = await db.select()
    .from(profiles)
    .where(eq(profiles.id, profileId))

  if (profileRows.length === 0) {
    throw new Error('Profile not found')
  }

  const profile = profileRows[0]
  const rootAccountId = profile.rootAccountId

  // Get or create profile_works record
  const existingRows = await db.select()
    .from(profileWorks)
    .where(and(
      eq(profileWorks.profileId, profileId),
      eq(profileWorks.workId, workId)
    ))

  let currentLiked = false
  let currentClaps = 0

  if (existingRows.length > 0) {
    currentLiked = existingRows[0].liked ?? false
    currentClaps = existingRows[0].claps ?? 0
  }

  if (action === 'like') {
    // Toggle like status
    const newLiked = !currentLiked

    if (existingRows.length > 0) {
      await db.update(profileWorks)
        .set({ liked: newLiked })
        .where(and(
          eq(profileWorks.profileId, profileId),
          eq(profileWorks.workId, workId)
        ))
    } else {
      await db.insert(profileWorks)
        .values({
          profileId,
          workId,
          liked: newLiked,
          claps: 0,
          status: 'now'
        })
    }

    return {
      success: true,
      liked: newLiked,
      claps: currentClaps
    }
  }

  if (action === 'clap') {
    // Check if user has enough points
    const pointsRows = await db.select()
      .from(rootAccountPoints)
      .where(eq(rootAccountPoints.rootAccountId, rootAccountId))

    const currentBalance = pointsRows.length > 0 ? (pointsRows[0].balance ?? 0) : 0

    if (currentBalance < clapPointCost) {
      throw new Error('Insufficient points')
    }

    // Begin transaction
    await db.execute(sql`BEGIN`)

    try {
      // Increment claps
      const newClaps = currentClaps + 1

      if (existingRows.length > 0) {
        await db.update(profileWorks)
          .set({ claps: newClaps })
          .where(and(
            eq(profileWorks.profileId, profileId),
            eq(profileWorks.workId, workId)
          ))
      } else {
        await db.insert(profileWorks)
          .values({
            profileId,
            workId,
            liked: false,
            claps: newClaps,
            status: 'now'
          })
      }

      // Deduct points
      await db.update(rootAccountPoints)
        .set({
          balance: sql`${rootAccountPoints.balance} - ${clapPointCost}`,
          lastUpdated: new Date()
        })
        .where(eq(rootAccountPoints.rootAccountId, rootAccountId))

      // Record point transaction
      await db.insert(pointTransactions)
        .values({
          rootAccountId,
          delta: -clapPointCost,
          reason: 'CLAP',
          relatedEntity: 'profile_works',
          relatedId: workId
        })

      await db.execute(sql`COMMIT`)

      const newBalance = currentBalance - clapPointCost

      return {
        success: true,
        liked: currentLiked,
        claps: newClaps,
        pointsRemaining: newBalance
      }
    } catch (error) {
      await db.execute(sql`ROLLBACK`)
      throw error
    }
  }

  throw new Error('Invalid action')
}

export default updateWorkReaction

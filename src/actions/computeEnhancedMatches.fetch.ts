'use server'

import { db } from '@/lib/db'
import { profileWorks, profileValues } from '@/db/schema'
import { computeEnhancedMatchScore, type ProfileValue } from '@/lib/match/computeValueMatches.logic'
import type { ProfileWork } from '@/lib/aggregations/workAggregations.logic'

export type EnhancedMatchesResult = {
  profileId: string
  workScore: number
  valueScore: number
  totalScore: number
  commonWorks: { workId: string; score: number }[]
  commonValues: { valueId: string }[]
}

/**
 * Compute enhanced matches for a profile using both works and values data.
 * This provides a more comprehensive matching algorithm that considers both
 * shared media preferences (works) and shared beliefs/principles (values).
 */
export async function computeEnhancedMatches(
  profileId: string,
  limit = 10
): Promise<EnhancedMatchesResult[]> {
  // Fetch all profile_works
  const workRows = await db.select().from(profileWorks)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allWorks: ProfileWork[] = workRows.map((r: any) => ({
    profileId: r.profile_id ?? r.profileId,
    workId: r.work_id ?? r.workId,
    tier: r.tier ?? null,
    status: r.status ?? undefined,
    claps: r.claps ?? 0,
    liked: r.liked ?? false,
  }))

  // Fetch all profile_values
  const valueRows = await db.select().from(profileValues)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allValues: ProfileValue[] = valueRows.map((r: any) => ({
    profileId: r.profile_id ?? r.profileId,
    valueId: r.value_id ?? r.valueId,
  }))

  // Get target profile's works and values
  const targetWorks = allWorks.filter(w => w.profileId === profileId)
  const targetValues = allValues.filter(v => v.profileId === profileId)

  // If target has no works and no values, return empty
  if (targetWorks.length === 0 && targetValues.length === 0) {
    return []
  }

  // Collect all other profile IDs that might be matches
  const otherProfileIds = new Set<string>()
  for (const w of allWorks) {
    if (w.profileId !== profileId) otherProfileIds.add(w.profileId)
  }
  for (const v of allValues) {
    if (v.profileId !== profileId) otherProfileIds.add(v.profileId)
  }

  // Compute enhanced match scores for each candidate
  const results: EnhancedMatchesResult[] = []

  for (const otherProfileId of otherProfileIds) {
    const otherWorks = allWorks.filter(w => w.profileId === otherProfileId)
    const otherValues = allValues.filter(v => v.profileId === otherProfileId)

    const score = computeEnhancedMatchScore({
      targetProfileId: profileId,
      otherProfileId,
      targetWorks,
      otherWorks,
      targetValues,
      otherValues,
    })

    // Only include if there's some score
    if (score.totalScore > 0) {
      results.push(score)
    }
  }

  // Sort by total score descending
  results.sort((a, b) => b.totalScore - a.totalScore)

  // Return top N
  return results.slice(0, limit)
}

export default computeEnhancedMatches

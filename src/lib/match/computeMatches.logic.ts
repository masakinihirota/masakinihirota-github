import { ProfileWork, scoreProfileWork } from '@/lib/aggregations/workAggregations.logic'

export type MatchResult = {
  profileId: string
  score: number
  commonWorks: { workId: string; score: number }[]
}

/**
 * Compute simple similarity-based matches for a profile using profile_works data.
 * For MVP we use a fast in-memory scoring approach: for every profile that shares
 * at least one work with the target profile, we sum the scoreProfileWork(pwA) + scoreProfileWork(pwB)
 * for each shared work.
 */
export function computeMatchesForProfile(targetProfileId: string, allProfileWorks: ProfileWork[], topN = 10): MatchResult[] {
  // map target profile's works
  const targetWorks = new Map<string, ProfileWork>()
  for (const pw of allProfileWorks) {
    if (pw.profileId === targetProfileId) targetWorks.set(pw.workId, pw)
  }

  if (targetWorks.size === 0) return []

  // collect other profiles' scores
  const buckets: Record<string, { score: number; common: Record<string, number> }> = {}

  for (const pw of allProfileWorks) {
    if (pw.profileId === targetProfileId) continue
    if (!targetWorks.has(pw.workId)) continue

    const t = targetWorks.get(pw.workId)!
    const sA = scoreProfileWork(t)
    const sB = scoreProfileWork(pw)

    const pairScore = sA + sB

    if (!buckets[pw.profileId]) buckets[pw.profileId] = { score: 0, common: {} }
    buckets[pw.profileId].score += pairScore
    buckets[pw.profileId].common[pw.workId] = (buckets[pw.profileId].common[pw.workId] ?? 0) + pairScore
  }

  const results: MatchResult[] = Object.entries(buckets).map(([pid, data]) => ({
    profileId: pid,
    score: data.score,
    commonWorks: Object.entries(data.common).map(([workId, score]) => ({ workId, score })),
  }))

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, topN)
}

export default computeMatchesForProfile

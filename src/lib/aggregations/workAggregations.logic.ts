export type Tier = 'tier1' | 'tier2' | 'tier3' | 'normal' | 'not_for_me'

export type ProfileWork = {
  profileId: string
  workId: string
  tier?: number | null // numeric tier stored (1/2/3) or null for normal/not_for_me
  status?: string
  claps?: number
  liked?: boolean
}

export type AggregationResult = {
  workId: string
  totalRatings: number
  avgScore: number
  totalScore: number
  clapsTotal: number
  likesCount: number
  tierCounts: Record<Tier, number>
}

// scoring weights — intentionally simple and testable
const TIER_SCORES: Record<number|string, number> = {
  1: 100,
  2: 50,
  3: 20,
}

const TIER_NAMES: Record<number|string, Tier> = {
  1: 'tier1',
 2: 'tier2',
 3: 'tier3',
}

const DEFAULT_SCORES_BY_TIER: Record<Tier, number> = {
  tier1: 100,
  tier2: 50,
  tier3: 20,
  normal: 5,
  not_for_me: -10,
}

const CLAP_WEIGHT = 1 // 1 point per clap
const LIKED_BONUS = 10

export function scoreProfileWork(pw: ProfileWork): number {
  const claps = pw.claps ?? 0
  const liked = pw.liked ? 1 : 0

  let tierScore: number
  if (pw.tier && typeof pw.tier === 'number') {
    tierScore = TIER_SCORES[pw.tier] ?? 0
  } else {
    // heuristics: treat string statuses or null as normal
    tierScore = DEFAULT_SCORES_BY_TIER.normal
  }

  // If tier present but outside 1,2,3 treat as normal
  if (tierScore === undefined) tierScore = DEFAULT_SCORES_BY_TIER.normal

  return tierScore + claps * CLAP_WEIGHT + liked * LIKED_BONUS
}

export function aggregateProfileWorks(items: ProfileWork[]): AggregationResult | null {
  if (!items || items.length === 0) return null

  const tierCounts: Record<Tier, number> = {
    tier1: 0,
    tier2: 0,
    tier3: 0,
    normal: 0,
    not_for_me: 0,
  }

  let totalScore = 0
  let clapsTotal = 0
  let likesCount = 0

  for (const it of items) {
    const s = scoreProfileWork(it)
    totalScore += s
    clapsTotal += it.claps ?? 0
    likesCount += it.liked ? 1 : 0

    if (it.tier && typeof it.tier === 'number') {
      const tname = TIER_NAMES[it.tier] ?? null
      if (tname) tierCounts[tname] += 1
      else tierCounts.normal += 1
    } else {
      // heuristics: if status explicitly not_for_me or similar, mark not_for_me
      if (it.status === 'not_for_me') tierCounts.not_for_me += 1
      else tierCounts.normal += 1
    }
  }

  const totalRatings = items.length
  const avgScore = totalRatings ? totalScore / totalRatings : 0

  return {
    workId: items[0].workId,
    totalRatings,
    avgScore,
    totalScore,
    clapsTotal,
    likesCount,
    tierCounts,
  }
}

// For test convenience, expose weights
export const __TESTING = {
  TIER_SCORES,
  DEFAULT_SCORES_BY_TIER,
  CLAP_WEIGHT,
  LIKED_BONUS,
}

import { db } from '@/lib/db'
import { profileWorks, workAggregates } from '@/db/schema'
import { aggregateProfileWorks, type ProfileWork } from '@/lib/aggregations/workAggregations.logic'

type RawProfileWorkRow = {
  profile_id: string
  work_id: string
  tier: number | null
  status: string | null
  claps: number | null
  liked: boolean | null
}

type UpsertPayload = {
  workId: string
  avgScore: string
  totalRatings: number
  totalScore: string
  clapsTotal: number
  likesCount: number
  tier1Count: number
  tier2Count: number
  tier3Count: number
  normalCount: number
  notForMeCount: number
  lastScoredAt: Date
}

export async function computeWorkAggregates() {
  // read all profile_works and group by work_id
  // Drizzle types are complex here — keep local typing flexible
  const rows = await db.select().from(profileWorks) as unknown as RawProfileWorkRow[]

  // group rows by workId
  const groups: Record<string, ProfileWork[]> = {}
  for (const r of rows) {
    const key = r.work_id
    if (!groups[key]) groups[key] = []
    groups[key].push({
      profileId: r.profile_id,
      workId: r.work_id,
      tier: r.tier,
      // normalize null -> undefined to match ProfileWork shape
      status: r.status ?? undefined,
      claps: r.claps ?? undefined,
      liked: r.liked ?? undefined,
    })
  }

  const upserts: UpsertPayload[] = []

  for (const workId of Object.keys(groups)) {
    const agg = aggregateProfileWorks(groups[workId])
    if (!agg) continue

    const payload = {
      workId: agg.workId,
      // drizzle numeric columns expect string/SQL — store numeric as string
      avgScore: String(agg.avgScore),
      totalRatings: agg.totalRatings,
      totalScore: String(agg.totalScore),
      clapsTotal: agg.clapsTotal,
      likesCount: agg.likesCount,
      tier1Count: agg.tierCounts.tier1,
      tier2Count: agg.tierCounts.tier2,
      tier3Count: agg.tierCounts.tier3,
      normalCount: agg.tierCounts.normal,
      notForMeCount: agg.tierCounts.not_for_me,
      lastScoredAt: new Date(),
    }

    upserts.push(payload)

    // upsert into work_aggregates
    await db.insert(workAggregates).values([payload]).onConflictDoUpdate({ target: [workAggregates.workId], set: { avgScore: payload.avgScore, totalRatings: payload.totalRatings, totalScore: payload.totalScore, clapsTotal: payload.clapsTotal, likesCount: payload.likesCount, tier1Count: payload.tier1Count, tier2Count: payload.tier2Count, tier3Count: payload.tier3Count, normalCount: payload.normalCount, notForMeCount: payload.notForMeCount, lastScoredAt: payload.lastScoredAt } })
  }

  return { success: true, processed: upserts.length }
}

export default computeWorkAggregates

import { db } from '@/lib/db'
import { profileWorks } from '@/db/schema'
import { computeMatchesForProfile } from '@/lib/match/computeMatches.logic'

export async function computeMatches(profileId: string, limit = 10) {
  // read all profile_works — for MVP we keep it simple and operate in-memory
  const rows = await db.select().from(profileWorks)

  // normalize rows to expected type — Drizzle rows may include other metadata
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = rows.map((r: any) => ({
    profileId: r.profile_id ?? r.profileId,
    workId: r.work_id ?? r.workId,
    tier: r.tier ?? null,
    status: r.status ?? undefined,
    claps: r.claps ?? 0,
    liked: r.liked ?? false,
  }))

  return computeMatchesForProfile(profileId, payload, limit)
}

export default computeMatches

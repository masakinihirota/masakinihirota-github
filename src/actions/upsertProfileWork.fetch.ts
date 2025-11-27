import { db } from '@/lib/db'
import { profileWorks } from '@/db/schema'

export type UpsertProfileWorkPayload = {
  profileId?: string
  workId?: string
  status?: string
  tier?: number | null
  claps?: number | null
  liked?: boolean | null
}

export async function upsertProfileWork(payload: UpsertProfileWorkPayload, ctx?: { session?: { user?: { id: string } } } | null) {
  // basic validation
  if (!payload?.profileId || !payload.profileId.trim() || !payload?.workId || !payload.workId.trim()) {
    throw { code: 400, name: 'ValidationError', message: 'profileId and workId are required' }
  }

  if (!ctx?.session || !ctx.session.user) {
    throw { code: 401, name: 'UnauthorizedError', message: 'unauthenticated' }
  }

  // Minimal upsert (GREEN): try insert, on conflict update the provided fields
  await db.insert(profileWorks).values([{ profileId: payload.profileId, workId: payload.workId, status: payload.status ?? 'now', tier: payload.tier ?? null, claps: payload.claps ?? 0, liked: payload.liked ?? false }]).onConflictDoUpdate({ target: [profileWorks.profileId, profileWorks.workId], set: { status: payload.status ?? 'now', tier: payload.tier ?? null, claps: payload.claps ?? 0, liked: payload.liked ?? false } })

  return { success: true }
}

export default upsertProfileWork

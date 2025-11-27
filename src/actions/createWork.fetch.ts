/**
 * Minimal createWork Server Action (GREEN step)
 * - Validates payload
 * - Requires authenticated user
 * - Inserts into works table and returns created id
 */
import { db } from '@/lib/db'
import { works } from '@/db/schema'
import { normalizeAndValidateWork, type CreateWorkPayload } from '@/lib/work/createWork.logic'

export async function createWork(payload: CreateWorkPayload, ctx?: { session?: { user?: { id: string } } } | null) {
  const validated = normalizeAndValidateWork(payload)

  if (!ctx?.session || !ctx.session.user) {
    throw { code: 401, name: 'UnauthorizedError', message: 'unauthenticated' }
  }

  // Minimal insert — createdBy is optional / can be null if no root account relation is passed
  const inserted = await db.insert(works).values([{ title: validated.title, categoryId: validated.categoryId, authors: validated.authors, releaseYear: validated.releaseYear, size: validated.size }]).returning()

  return { success: true, workId: inserted[0].id }
}

export default createWork

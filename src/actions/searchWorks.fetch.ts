"use server"

import { db } from '@/lib/db'
import { sql } from 'drizzle-orm'

export async function searchWorks(payload: { q?: string }) {
  const q = payload.q?.toString() ?? ''
  if (!q || q.trim().length === 0) {
    throw { code: 400, name: 'ValidationError', message: 'q is required' }
  }

  // Minimal search — match title case-insensitive and return id, title
  const pattern = `%${q.toLowerCase()}%`
  const rows = await db.execute(sql`SELECT id, title FROM public.works WHERE LOWER(title) LIKE ${pattern} LIMIT 10`)
  return rows
}

export default searchWorks

"use client"

import { searchWorks } from '@/actions/searchWorks.fetch'

export async function searchWorksAction(_prevState: unknown, formData: FormData) {
  const q = formData.get('q')?.toString() ?? ''

  if (!q || q.trim().length === 0) {
    return { success: true, data: [] }
  }

  try {
    const result = await searchWorks({ q })
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err }
  }
}

export default searchWorksAction

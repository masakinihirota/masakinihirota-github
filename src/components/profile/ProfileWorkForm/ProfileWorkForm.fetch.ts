"use client"

import { upsertProfileWork } from '@/actions/upsertProfileWork.fetch'

export async function upsertProfileWorkAction(_prevState: unknown, formData: FormData) {
  const profileId = formData.get('profileId')?.toString() ?? ''
  const workId = formData.get('workId')?.toString() ?? ''
  const status = formData.get('status')?.toString() ?? 'now'
  const tierStr = formData.get('tier')?.toString() ?? ''
  const tier = tierStr ? parseInt(tierStr, 10) : null
  const clapsStr = formData.get('claps')?.toString() ?? ''
  const claps = clapsStr ? parseInt(clapsStr, 10) : 0
  const liked = formData.get('liked') === 'true'

  try {
    const result = await upsertProfileWork({ profileId, workId, status, tier, claps, liked })
    return { success: true, data: result }
  } catch (err) {
    return { success: false, error: err }
  }
}

export default upsertProfileWorkAction

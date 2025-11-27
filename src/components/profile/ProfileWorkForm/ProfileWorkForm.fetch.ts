"use client"

// Client wrapper that uses server API route to perform upsertProfileWork.
// Avoids importing server-only modules from the client bundle.
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
    const res = await fetch('/api/profile-works', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, workId, status, tier, claps, liked }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return { success: false, error: errorText }
    }

    const payload = await res.json()
    return payload
  } catch (err) {
    return { success: false, error: err }
  }
}

export default upsertProfileWorkAction

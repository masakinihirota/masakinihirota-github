"use client"

// Client wrapper for CreateProfileForm — posts to server API route to avoid bundling server-only modules.
export async function createProfileAction(_prevState: unknown, formData: FormData) {
  const name = formData.get('name')?.toString() ?? ''
  const role = formData.get('role')?.toString() ?? 'member'
  const type = formData.get('type')?.toString() ?? 'self'
  const valuesStr = formData.get('values')?.toString()
  const values = valuesStr ? JSON.parse(valuesStr) : undefined

  if (!name || name.trim().length === 0) {
    return { success: false, errors: { name: ['name is required'] }, message: 'Validation failed' }
  }

  try {
    const res = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rootAccountId: 'root_1', name: name.trim(), role, type, values }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return { success: false, error: errText }
    }

    const json = await res.json()
    return json
  } catch (err) {
    return { success: false, error: err }
  }
}

export default createProfileAction

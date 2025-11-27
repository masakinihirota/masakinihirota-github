"use server"

import { createProfile } from '@/actions/createProfile.fetch'

export async function createProfileAction(_prevState: unknown, formData: FormData) {
  const name = formData.get('name')?.toString() ?? ''
  const role = formData.get('role')?.toString() ?? 'member'
  const type = formData.get('type')?.toString() ?? 'self'

  // Minimal validation — keep consistent with logic layer
  if (!name || name.trim().length === 0) {
    return { success: false, errors: { name: ['name is required'] }, message: 'Validation failed' }
  }

  try {
    // Call central action — in prod this should ensure session exists
    const result = await createProfile({ rootAccountId: 'root_1', name: name.trim(), role, type }, { session: { user: { id: 'user-123' } } })
    return { success: true, data: result }
  } catch (err) {
    return { success: false, message: 'Server error', error: err }
  }
}

export default createProfileAction

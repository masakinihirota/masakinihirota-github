/**
 * Minimal createProfile Server Action implementation (GREEN step).
 * - Validates payload first (ValidationError)
 * - Checks authentication next (UnauthorizedError)
 * - Returns a minimal success payload when valid
 */
export async function createProfile(
  payload: { rootAccountId: string; name?: string; role?: string; type?: string },
  ctx?: { session?: { user?: { id: string } } } | null
) {
  // Validation first
  if (!payload?.name || payload.name.trim().length === 0) {
    throw { code: 400, name: 'ValidationError', message: 'name is required', details: { name: 'required' } }
  }

  // Authentication check
  if (!ctx?.session || !ctx.session.user) {
    throw { code: 401, name: 'UnauthorizedError', message: 'unauthenticated' }
  }

  // Minimal success response for GREEN; actual DB logic implemented later
  return { success: true, profileId: `profile_${Date.now()}` }
}

export default createProfile

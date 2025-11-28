import { normalizeAndValidateProfile, type CreateProfilePayload } from '@/lib/profile/createProfile.logic'
import { createProfile as createProfileCore } from '@/actions/createProfile.fetch'

/**
 * Server Action wrapper for creating a profile from App Router pages.
 * Validates payload and ensures an authenticated session before delegating to core action.
 */
export async function createProfile(
  payload: CreateProfilePayload & { role?: string; type?: string },
  ctx?: { session?: { user?: { id: string } } } | null
) {
  // validate using existing logic
  const validated = normalizeAndValidateProfile(payload)

  // require auth for App Router Server Action
  if (!ctx?.session || !ctx.session.user) {
    throw { code: 401, name: 'UnauthorizedError', message: 'unauthenticated' }
  }

  // delegate to central action implementation (reuses DB logic + tests)
  return createProfileCore(validated, ctx)
}

export default createProfile

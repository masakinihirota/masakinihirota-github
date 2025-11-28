export type CreateProfilePayload = {
  rootAccountId: string
  name?: string
  role?: string
  type?: string
}

export function normalizeAndValidateProfile(payload: CreateProfilePayload) {
  if (!payload?.name || payload.name.trim().length === 0) {
    throw { code: 400, name: 'ValidationError', message: 'name is required' }
  }

  const sanitized = {
    ...payload,
    name: payload.name.trim(),
    role: payload.role ?? 'member',
    type: payload.type ?? 'self',
  }

  // example length check
  if (sanitized.name.length > 200) {
    throw { code: 400, name: 'ValidationError', message: 'name too long' }
  }

  return sanitized
}

export default normalizeAndValidateProfile

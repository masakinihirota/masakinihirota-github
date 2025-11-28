export type CreateProfilePayload = {
  rootAccountId: string
  name?: string
  role?: string
  type?: string
  values?: string[]
  skills?: string[]
  // external links / contact inputs
  links?: Array<{ url: string; label?: string; type?: string }>
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
    values: Array.isArray(payload.values) ? payload.values.filter(Boolean).map(String) : undefined,
    skills: Array.isArray(payload.skills) ? payload.skills.filter(Boolean).map(String) : undefined,
    links: Array.isArray(payload.links)
      ? payload.links
          .filter(Boolean)
          .map((l: any) => ({ url: typeof l.url === 'string' ? l.url.trim() : '', label: l.label ? String(l.label).trim() : undefined, type: l.type ? String(l.type) : undefined }))
      : undefined,
  }

  // example length check
  if (sanitized.name.length > 200) {
    throw { code: 400, name: 'ValidationError', message: 'name too long' }
  }

  // validate links if provided: ensure each has a valid URL
  if (Array.isArray(sanitized.links)) {
    for (const l of sanitized.links) {
      if (!l?.url || typeof l.url !== 'string' || l.url.length === 0) {
        throw { code: 400, name: 'ValidationError', message: 'invalid link url' }
      }
      try {
        // constructor will throw for invalid URLs
        // allow relative urls? we expect absolute URLs for external links here
        new URL(l.url)
      } catch (err) {
        throw { code: 400, name: 'ValidationError', message: 'invalid link url' }
      }
    }
  }

  return sanitized
}

export default normalizeAndValidateProfile

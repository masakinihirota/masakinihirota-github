export type CreateWorkPayload = {
  title?: string
  categoryId?: string
  authors?: string[]
  releaseYear?: number
  size?: string
}

export function normalizeAndValidateWork(payload: CreateWorkPayload) {
  if (!payload?.title || payload.title.trim().length === 0) {
    throw { code: 400, name: 'ValidationError', message: 'title is required' }
  }

  const sanitized = {
    title: payload.title.trim(),
    categoryId: payload.categoryId ?? 'other',
    authors: payload.authors ?? [],
    releaseYear: payload.releaseYear,
    size: payload.size ?? 'unknown',
  }

  if (sanitized.title.length > 400) {
    throw { code: 400, name: 'ValidationError', message: 'title too long' }
  }

  return sanitized
}

export default normalizeAndValidateWork

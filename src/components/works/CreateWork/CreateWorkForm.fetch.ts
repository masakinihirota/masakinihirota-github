"use client"

import { createWork } from '@/actions/createWork.fetch'

export async function createWorkAction(_prevState: unknown, formData: FormData) {
  const title = formData.get('title')?.toString() ?? ''
  const categoryId = formData.get('categoryId')?.toString() ?? 'other'
  const authors = formData.get('authors')?.toString() ?? ''
  const releaseYearStr = formData.get('releaseYear')?.toString() ?? ''
  const releaseYear = releaseYearStr ? parseInt(releaseYearStr, 10) : undefined
  const size = formData.get('size')?.toString() ?? ''
  const mediaUrl = formData.get('mediaUrl')?.toString() ?? undefined

  if (!title || title.trim().length === 0) {
    return { success: false, errors: { title: ['title is required'] }, message: 'Validation failed' }
  }

  try {
    const payload = { title: title.trim(), categoryId, authors: authors ? authors.split(',').map((s) => s.trim()) : [], releaseYear, size, mediaUrl }
    const result = await createWork(payload, { session: { user: { id: 'user-123' } } })
    return { success: true, data: result }
  } catch (err) {
    return { success: false, message: 'Server error', error: err }
  }
}

export default createWorkAction

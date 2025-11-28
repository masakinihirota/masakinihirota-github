import { vi } from 'vitest'

type DbMocks = {
  execute?: any
  select?: any
  insert?: any
  // add other DB methods here as needed
}

/**
 * Set up a controlled mock for '@/lib/db' for use in tests.
 * Call this before importing any module that itself imports '@/lib/db'.
 * Returns the mock functions so tests can assert calls/return values.
 */
export function setupDbMock(mocks: DbMocks = {}) {
  const execute = vi.fn(async (...args: any[]) => {
    if (typeof mocks.execute === 'function') return await mocks.execute(...args)
    return mocks.execute ?? []
  })

  // select should be synchronous so callers can do db.select().from(...)
  const select = vi.fn((...args: any[]) => {
    if (typeof mocks.select === 'function') return mocks.select(...args)
    return mocks.select ?? []
  })

  const insert = vi.fn((...args: any[]) => {
    if (typeof mocks.insert === 'function') return mocks.insert(...args)
    return mocks.insert ?? { values: [] }
  })

  // Provide a default minimal shape that mirrors parts of the real db object
  // Use doMock to avoid vi.mock hoisting issues when factories reference runtime values
  if (typeof (vi as any).doMock === 'function') {
    ;(vi as any).doMock('@/lib/db', () => ({ db: { execute, select, insert } }))
  } else {
    // fallback to vi.mock if doMock not available
    vi.mock('@/lib/db', () => ({ db: { execute, select, insert } }))
  }

  return { execute, select, insert }
}

export default setupDbMock

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
// keep a module-level store for the current mock implementations so the
// vitest hoisted mock factory can safely reference them without causing a
// ReferenceError when vi.mock is hoisted.
let currentMocks: DbMocks = {}

const execute = vi.fn(async (...args: any[]) => {
  if (typeof currentMocks.execute === 'function') return await currentMocks.execute(...args)
  return currentMocks.execute ?? []
})

// select should be synchronous so callers can do db.select().from(...)
const select = vi.fn((...args: any[]) => {
  if (typeof currentMocks.select === 'function') return currentMocks.select(...args)
  return currentMocks.select ?? []
})

const insert = vi.fn((...args: any[]) => {
  if (typeof currentMocks.insert === 'function') return currentMocks.insert(...args)
  // default behavior: return an object that supports .values() -> .returning()
  return currentMocks.insert ?? { values: () => ({ returning: () => [] }) }
})

// Always register the mock. Using a module-scoped currentMocks avoids
// the hoisting problem when vitest processes vi.mock factories.
vi.mock('@/lib/db', () => ({ db: { execute, select, insert } }))

export function setupDbMock(mocks: DbMocks = {}) {
  currentMocks = mocks
  // Reset spies between tests so callers can assert calls reliably.
  execute.mockReset()
  select.mockReset()
  insert.mockReset()

  // Return the actual spies so tests can make assertions on them
  return { execute, select, insert }
}

export default setupDbMock

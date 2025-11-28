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
// Internal implementation placeholders (assignable by setupDbMock)
// module-level spies used as the mocked db functions. Declared at module
// initialization time so vi.mock factory (which is hoisted) can safely
// reference them and tests can call .mockReturnValue on them.
// Current configured implementations — updated by setupDbMock at runtime.
let currentMocks: DbMocks | null = null

export const executeSpy = vi.fn(async (...args: any[]) => {
  if (currentMocks && typeof currentMocks.execute === 'function') return await currentMocks.execute(...args)
  return currentMocks?.execute ?? []
})

export const selectSpy = vi.fn((...args: any[]) => {
  if (currentMocks && typeof currentMocks.select === 'function') return currentMocks.select(...args)
  return currentMocks?.select ?? []
})

export const insertSpy = vi.fn((...args: any[]) => {
  if (currentMocks && typeof currentMocks.insert === 'function') return currentMocks.insert(...args)
  return currentMocks?.insert ?? { values: [] }
})

export function setupDbMock(mocks: DbMocks = {}) {
  // Create spy wrappers around the implementation placeholders, and set
  // the internal implementation to call those spies so tests can assert calls.
  // configure the module-level spies to delegate to provided mocks
  // Set the current mock implementations so the hoisted spies consult them.
  currentMocks = mocks

  // select should be synchronous so callers can do db.select().from(...)
  // (no-op) spies read currentMocks at invocation time

  // module-level spies are ready; expose them via the mocked module below

  // Provide a default minimal shape that mirrors parts of the real db object
  // Use doMock to avoid vi.mock hoisting issues when factories reference runtime values
  if (typeof (vi as any).doMock === 'function') {
    ;(vi as any).doMock('@/lib/db', () => ({ db: { execute: executeSpy, select: selectSpy, insert: insertSpy } }))
  } else {
    // fallback to vi.mock if doMock not available
    vi.mock('@/lib/db', () => ({ db: { execute: executeSpy, select: selectSpy, insert: insertSpy } }))
  }

  return { execute: executeSpy, select: selectSpy, insert: insertSpy }
}

export default setupDbMock

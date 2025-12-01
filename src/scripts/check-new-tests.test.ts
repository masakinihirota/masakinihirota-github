import { describe, it, expect } from 'vitest'
import { parseAddedTestsFromDiff, parseVitestJson } from '../../scripts/check-new-tests.js'

describe('check-new-tests script helpers', () => {
  it('parses added test files from git diff output', () => {
    const sample = `A\tsrc/new.spec.test.ts\nA\tsrc/other.test.ts\nM\tsrc/changed.ts`;
    const files = parseAddedTestsFromDiff(sample)
    expect(files).toEqual(['src/new.spec.test.ts', 'src/other.test.ts'])
  })

  it('parses vitest json output for failing count', () => {
    const json = JSON.stringify({ numFailedTests: 2, numTotalTests: 5 })
    const count = parseVitestJson(json)
    expect(count).toBe(2)
  })
})

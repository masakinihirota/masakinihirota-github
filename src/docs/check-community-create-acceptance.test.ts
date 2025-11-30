import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Community create acceptance doc presence (RED)', () => {
  it('has docs/community/create-acceptance.md in the repo', () => {
    const p = path.resolve(process.cwd(), 'docs', 'community', 'create-acceptance.md')
    expect(fs.existsSync(p)).toBe(true)
  })
})

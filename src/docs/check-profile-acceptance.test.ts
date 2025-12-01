import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Profile acceptance doc presence (RED)', () => {
  it('has docs/profile/profile-acceptance.md in the repo', () => {
    const p = path.resolve(process.cwd(), 'docs', 'profile', 'profile-acceptance.md')
    expect(fs.existsSync(p)).toBe(true)
  })
})

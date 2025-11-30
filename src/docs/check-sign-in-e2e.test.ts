import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Sign-in E2E doc presence (RED)', () => {
  it('has docs/auth/sign-in-e2e.md in the repo', () => {
    const p = path.resolve(process.cwd(), 'docs', 'auth', 'sign-in-e2e.md')
    expect(fs.existsSync(p)).toBe(true)
  })
})

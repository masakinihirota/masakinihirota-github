import { describe, it, expect } from 'vitest'
import manifest from '@/config/routes.manifest.json'
import { publicNav, authNav, footerNav } from './nav'

describe('nav.ts vs routes.manifest.json', () => {
  const manifestPaths = manifest.map((r) => r.path)

  it('publicNav entries should exist in manifest', () => {
    const missing = publicNav.map((n) => n.href).filter((href) => !manifestPaths.includes(href))
    // allow some publicNav like '/login' '/register' not present in protected manifest
    // but expect 'about','help','oasis' to exist
    // allow '/login','/register' and root '/' (public home) to be missing from manifest
    expect(missing.filter(h => !['/login','/register','/'].includes(h))).toEqual([])
  })

  it('footerNav entries should exist in manifest', () => {
    const missing = footerNav.map((n)=>n.href).filter(h => !manifestPaths.includes(h))
    expect(missing).toEqual([])
  })

  it('authNav items should resolve to manifest paths', () => {
    const missing = authNav.map((n)=>n.href).filter(h => !manifestPaths.includes(h))
    // authNav may contain '/home', which is in manifest
    expect(missing).toEqual([])
  })
})

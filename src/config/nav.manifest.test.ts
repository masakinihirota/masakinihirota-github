import routesManifest from './routes.manifest.json'
import { publicNav, footerNav } from './nav'
import { describe, it, expect } from 'vitest'

describe('nav vs routes.manifest.json', () => {
  it('footerNav items exist in manifest and belong to footer group', () => {
    const manifest = (routesManifest as any[])

    for (const item of footerNav) {
      const m = manifest.find((r) => r.path === item.href)
      expect(m).toBeDefined()
      expect(m?.group).toBe('footer')
      expect(m?.visibleInMenu).toBeTruthy()
    }
  })

  it('publicNav (except / and /login) should exist in manifest', () => {
    const manifest = (routesManifest as any[])
    const allowedMissing = ['/', '/login']

    for (const item of publicNav) {
      if (allowedMissing.includes(item.href)) continue
      const m = manifest.find((r) => r.path === item.href)
      expect(m).toBeDefined()
    }
  })
})

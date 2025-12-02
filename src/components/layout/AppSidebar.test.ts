import { describe, it, expect } from 'vitest'
import manifest from '@/config/routes.manifest.json'
import { ICON_MAP, toSidebarUrl, iconFor } from './AppSidebar'

describe('AppSidebar manifest integration', () => {
  it('should have icon mapping for each visible menu route in manifest', () => {
    const visiblePaths = manifest.filter((r) => r.visibleInMenu).map((r) => r.path)
    const missing = visiblePaths.filter((p) => !Object.prototype.hasOwnProperty.call(ICON_MAP, p))
    expect(missing).toEqual([])
  })

  it('toSidebarUrl should return manifest path, not /home-prefixed', () => {
    expect(toSidebarUrl('/matching')).toBe('/matching')
    expect(toSidebarUrl('/')).toBe('/')
    expect(toSidebarUrl('/home')).toBe('/home')
  })

  it('iconFor returns a Lucide component (fallback allowed)', () => {
    for (const entry of manifest) {
      if (!entry.visibleInMenu) continue
      const icon = iconFor(entry.path)
      // lucide-react icons can be functions or objects depending on the bundler/runtime
      expect(icon).toBeDefined()
      expect(['function', 'object']).toContain(typeof icon)
    }
  })
})

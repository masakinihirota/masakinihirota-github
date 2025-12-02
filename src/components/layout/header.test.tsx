// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Header } from './header'
import { publicNav } from '@/config/nav'

// Mock GlobalHeaderMenu to avoid useRouter errors during render
vi.mock('@/components/layout/GlobalHeaderMenu', () => ({
  GlobalHeaderMenu: () => <div data-testid="ghm" />,
}))

describe('Header nav uses publicNav', () => {
  it('does not render publicNav items (header kept slim)', () => {
    render(<Header />)
    for (const nav of publicNav) {
      // header intentionally hides publicNav links to avoid duplicates — none should be present
      expect(screen.queryByText(nav.label)).toBeNull()
    }
  })
})

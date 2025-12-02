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
  it('renders public links in header', () => {
    render(<Header />)
    for (const nav of publicNav) {
      // only check that labels are present as text nodes in header (not all links may appear on small screens)
      if (nav.href === '/login' || nav.href === '/register') continue
      expect(screen.getByText(nav.label)).toBeTruthy()
    }
  })
})

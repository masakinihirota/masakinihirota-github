/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileView } from './ProfileView'

describe('ProfileView (RED)', () => {
  it('renders display name when given user object', () => {
    render(<ProfileView user={{ id: 'u1', name: 'test', displayName: 'Test User' }} />)

    expect(screen.getByText(/Test User/)).toBeInTheDocument()
  })
})

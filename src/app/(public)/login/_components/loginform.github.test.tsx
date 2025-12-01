import { render, screen } from '@testing-library/react'
/** @vitest-environment jsdom */
import { describe, it, expect } from 'vitest'
import { LoginForm } from './LoginForm'

describe('LoginForm - GitHub expectation (RED)', () => {
  it('renders Sign in with GitHub button (this test intentionally fails until GitHub provider is supported)', () => {
    render(<LoginForm />)
    // Expect a GitHub button — currently LoginForm only renders Google, so this will fail
    expect(screen.getByRole('button', { name: /sign in with github/i })).toBeInTheDocument()
  })
})

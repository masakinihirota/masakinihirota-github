import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { LoginForm } from './LoginForm'
import * as supabaseClient from '@/lib/supabase/client'

// Mock createClient
const { mockSignInWithOAuth } = vi.hoisted(() => {
    return { mockSignInWithOAuth: vi.fn() }
})

vi.mock('@/lib/supabase/client', () => ({
    createClient: vi.fn(() => ({
        auth: {
            signInWithOAuth: mockSignInWithOAuth,
        },
    })),
}))

describe('LoginForm', () => {
    const originalLocation: any = window.location

    beforeEach(() => {
        vi.clearAllMocks()
        mockSignInWithOAuth.mockResolvedValue({ error: null })

        // Mock location.origin
        delete (window as any).location
        window.location = { ...originalLocation, origin: 'http://localhost:3000' } as any
    })

    afterEach(() => {
        // restore original location
        ; (window as any).location = originalLocation
    })

    it('renders login button', () => {
        render(<LoginForm />)
        expect(screen.getByRole('button', { name: /sign in with google/i })).toBeInTheDocument()
    })

    it('calls signInWithOAuth when button is clicked', async () => {
        const logSpy = vi.spyOn(console, 'log')
        render(<LoginForm />)
        const button = screen.getByRole('button', { name: /sign in with google/i })

        fireEvent.click(button)

        await waitFor(() => {
            expect(logSpy).toHaveBeenCalledWith('handleLogin called')
            expect(logSpy).toHaveBeenCalledWith('Calling createClient')
            expect(mockSignInWithOAuth).toHaveBeenCalled()

            expect(mockSignInWithOAuth).toHaveBeenCalledWith({
                provider: 'google',
                options: {
                    redirectTo: 'http://localhost:3000/auth/callback',
                },
            })
        })
    })

    it('shows loading state while connecting', async () => {
        // Delay the resolution to check loading state
        mockSignInWithOAuth.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ error: null }), 100)))

        render(<LoginForm />)
        const button = screen.getByRole('button', { name: /sign in with google/i })

        fireEvent.click(button)

        expect(screen.getByRole('button')).toHaveTextContent(/connecting/i)
        expect(button).toBeDisabled()

        await waitFor(() => {
            expect(button).not.toBeDisabled()
            expect(button).toHaveTextContent(/sign in with google/i)
        })
    })

    it('handles error gracefully', async () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        mockSignInWithOAuth.mockResolvedValue({ error: new Error('Login failed') })

        render(<LoginForm />)
        const button = screen.getByRole('button', { name: /sign in with google/i })

        fireEvent.click(button)

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith('Login error:', expect.any(Error))
        })

        // Should return to normal state
        expect(button).not.toBeDisabled()

        consoleSpy.mockRestore()
    })
})

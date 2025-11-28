// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { GoogleLoginForm } from './google-login-form'
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

describe('GoogleLoginForm', () => {
    let originalLocation: Location

    beforeEach(() => {
        originalLocation = window.location
        vi.clearAllMocks()
        mockSignInWithOAuth.mockResolvedValue({ error: null })

        // Mock location.origin
        delete (window as any).location
        window.location = { ...originalLocation, origin: 'http://localhost:3000' } as any
    })

    afterEach(() => {
        window.location = originalLocation
    })

    it('renders login button', () => {
        render(<GoogleLoginForm />)
        expect(screen.getByRole('button', { name: /サインイン/i })).toBeInTheDocument()
    })

    it('calls signInWithOAuth when button is clicked', async () => {
        render(<GoogleLoginForm />)
        const button = screen.getByRole('button', { name: /サインイン/i })

        fireEvent.click(button)

        await waitFor(() => {
            expect(mockSignInWithOAuth).toHaveBeenCalledWith({
                provider: 'google',
                options: {
                    redirectTo: 'http://localhost:3000/auth/callback?next=/dashboard',
                },
            })
        })
    })

    it('handles error gracefully', async () => {
        mockSignInWithOAuth.mockResolvedValue({ error: new Error('Login failed') })

        render(<GoogleLoginForm />)
        const button = screen.getByRole('button', { name: /サインイン/i })

        fireEvent.click(button)

        await waitFor(() => {
            expect(screen.getByText('Login failed')).toBeInTheDocument()
        })

        // Should return to normal state
        expect(button).not.toBeDisabled()
    })
})

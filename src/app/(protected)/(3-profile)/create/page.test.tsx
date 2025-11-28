/** @vitest-environment jsdom */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock CreateProfileForm to avoid client-side complexity
vi.mock('@/components/profile/CreateProfileForm/CreateProfileForm', () => ({
    CreateProfileForm: () => <div data-testid="mock-form">MOCK_FORM</div>,
}))

import Page from './page'

describe('Create Profile page', () => {
    it('renders heading and form placeholder', () => {
        render(<Page />)

        expect(screen.getByText(/Create Profile/i)).toBeInTheDocument()
        expect(screen.getByTestId('mock-form')).toBeInTheDocument()
    })
})

/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CreateProfileForm } from './CreateProfileForm'
import * as fetchLogic from './CreateProfileForm.fetch'

// Mock the server action wrapper
vi.mock('./CreateProfileForm.fetch', () => ({
    createProfileAction: vi.fn(),
}))

describe('CreateProfileForm (UI) - RED tests', () => {
    it('renders form fields and submit button', () => {
        render(<CreateProfileForm />)
        expect(screen.queryByLabelText(/Profile Name/i)).not.toBeNull()
        expect(screen.getByRole('button', { name: /Create Profile/i })).not.toBeNull()
    })

    it('shows validation error and does not call server action when name is empty', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)

        render(<CreateProfileForm />)

        const submitButton = screen.getByRole('button', { name: /Create Profile/i })

        await user.click(submitButton)

        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument()
            expect(mockAction).not.toHaveBeenCalled()
        })
    })

    it('calls createProfileAction with correct data on valid submit', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true })

        render(<CreateProfileForm />)

        const nameInput = screen.getByLabelText(/Profile Name/i)
        const submitButton = screen.getByRole('button', { name: /Create Profile/i })

        await user.type(nameInput, 'Test Profile')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const formData = args[1] as FormData
            expect(formData.get('name')).toBe('Test Profile')
        })
    })
})

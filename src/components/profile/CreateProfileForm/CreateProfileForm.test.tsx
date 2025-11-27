/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CreateProfileForm } from '@/components/profile/CreateProfileForm/CreateProfileForm'
import * as fetchLogic from '@/components/profile/CreateProfileForm/CreateProfileForm.fetch'

// Mock server action wrappers and WorkSearch
vi.mock('./CreateProfileForm.fetch', () => ({ createProfileAction: vi.fn() }))
vi.mock('@/components/profile/ProfileWorkForm/ProfileWorkForm.fetch', () => ({ upsertProfileWorkAction: vi.fn() }))
vi.mock('@/components/works/WorkSearch/WorkSearch', () => ({
    WorkSearch: ({ onSelect }: { onSelect?: (w: { id: string; title: string }) => void }) => (
        <button onClick={() => onSelect?.({ id: 'w-1', title: '走れメロス' })}>Mock Add</button>
    )
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

    it('calls createProfileAction with correct data on valid submit and upserts selected works', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true, profileId: 'test-profile-1', organizationId: null } })
        const mockUpsert = vi.mocked((await import('@/components/profile/ProfileWorkForm/ProfileWorkForm.fetch')).upsertProfileWorkAction)
        mockUpsert.mockResolvedValue({ success: true, data: { success: true } })

        render(<CreateProfileForm />)

        const nameInput = screen.getByLabelText(/Profile Name/i)
        const submitButton = screen.getByRole('button', { name: /Create Profile/i })

        // add a work using mocked WorkSearch
        await user.click(screen.getByRole('button', { name: /Mock Add/i }))

        await user.type(nameInput, 'Test Profile')
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const formData = args[1] as FormData
            expect(formData.get('name')).toBe('Test Profile')

            // ensure upsertProfileWorkAction was called with a FormData that includes profileId and workId
            expect(mockUpsert).toHaveBeenCalled()
            const upsertArgs = mockUpsert.mock.calls[0]
            const upsertFd = upsertArgs[1] as FormData
            expect(upsertFd.get('workId')).toBe('w-1')
        })
    })
})

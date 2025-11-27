/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { ProfileWorkForm } from './ProfileWorkForm'
import * as fetchLogic from './ProfileWorkForm.fetch'

vi.mock('./ProfileWorkForm.fetch', () => ({ upsertProfileWorkAction: vi.fn() }))

describe('ProfileWorkForm UI - RED tests', () => {
    it('renders fields and save button', () => {
        render(<ProfileWorkForm profileId="p1" workId="w1" />)
        expect(screen.getByText(/Status/i)).toBeTruthy()
        expect(screen.getByText(/Tier/i)).toBeTruthy()
        expect(screen.getByRole('button', { name: /Save/i })).toBeTruthy()
    })

    it('calls upsertProfileWorkAction with correct data on submit', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.upsertProfileWorkAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true } })

        render(<ProfileWorkForm profileId="p-test" workId="w-test" />)

        // choose tier and liked
        await user.selectOptions(screen.getByLabelText(/Tier/i), ['2'])
        await user.click(screen.getByLabelText(/Liked/i))

        await user.click(screen.getByRole('button', { name: /Save/i }))

        await waitFor(() => expect(mockAction).toHaveBeenCalled())
        const formData = mockAction.mock.calls[0][1] as FormData
        expect(formData.get('profileId')).toBe('p-test')
        expect(formData.get('workId')).toBe('w-test')
        expect(formData.get('tier')).toBe('2')
        expect(formData.get('liked')).toBe('true')
    })
})

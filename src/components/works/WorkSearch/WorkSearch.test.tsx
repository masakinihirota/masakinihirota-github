/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { WorkSearch } from './WorkSearch'
import * as fetchLogic from './WorkSearch.fetch'

vi.mock('./WorkSearch.fetch', () => ({
    searchWorksAction: vi.fn(),
}))

describe('WorkSearch UI - RED tests', () => {
    it('renders input and search button', () => {
        render(<WorkSearch />)
        expect(screen.getByRole('textbox')).toBeTruthy()
        expect(screen.getByRole('button', { name: /Search/i })).toBeTruthy()
    })

    it('calls searchWorksAction when searching and supports selection', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.searchWorksAction)
        mockAction.mockResolvedValue({ success: true, data: [{ id: 'w1', title: '走れメロス' }] })

        const mockSelect = vi.fn()
        render(<WorkSearch onSelect={mockSelect} />)
        const input = screen.getByRole('textbox')
        const button = screen.getByRole('button', { name: /Search/i })

        await user.type(input, 'メロス')
        await user.click(button)

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const callArgs = mockAction.mock.calls[0]
            expect(callArgs[1]).toBeInstanceOf(FormData)
            const formData = callArgs[1] as FormData
            expect(formData.get('q')).toBe('メロス')
        })

        await user.click(button)

        await waitFor(() => expect(screen.getByText(/走れメロス/)).toBeTruthy())

        // click add on the result
        await user.click(screen.getByRole('button', { name: /Add/i }))
        expect(mockSelect).toHaveBeenCalledWith({ id: 'w1', title: '走れメロス' })
    })
})

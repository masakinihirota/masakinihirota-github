/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

import { CreateWorkForm } from './CreateWorkForm'
import * as fetchLogic from './CreateWorkForm.fetch'

vi.mock('./CreateWorkForm.fetch', () => ({ createWorkAction: vi.fn() }))

describe('CreateWorkForm - UI tests', () => {
    it('renders fields and creates work', async () => {
        const user = userEvent.setup()
        const mock = vi.mocked(fetchLogic.createWorkAction)
        mock.mockResolvedValue({ success: true, data: { success: true, workId: 'work-123' } })

        render(<CreateWorkForm />)

        await user.type(screen.getByLabelText(/work-title/i), 'Test Work')
        await user.selectOptions(screen.getByLabelText(/work-category/i), ['novel'])
        await user.type(screen.getByLabelText(/work-authors/i), 'Author A, Author B')
        await user.type(screen.getByLabelText(/work-year/i), '2020')
        await user.type(screen.getByLabelText(/work-size/i), 'Short')

        await user.click(screen.getByRole('button', { name: /Create Work/i }))

        await waitFor(() => expect(mock).toHaveBeenCalled())
        const args = mock.mock.calls[0]
        const fd = args[1] as FormData
        expect(fd.get('title')).toBe('Test Work')
        expect(fd.get('categoryId')).toBe('novel')
    })
})

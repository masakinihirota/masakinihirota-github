/** @vitest-environment jsdom */
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
    beforeEach(() => {
        vi.clearAllMocks()
    })
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

    it('renders role and type selects with defaults and allows submitting them', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)

        render(<CreateProfileForm />)

        // role and type selects should be present with defaults
        expect(screen.getByLabelText(/Role/i)).toBeInTheDocument()
        expect(screen.getByLabelText(/Type/i)).toBeInTheDocument()

        // default values
        const roleSelect = screen.getByLabelText(/Role/i) as HTMLSelectElement
        const typeSelect = screen.getByLabelText(/Type/i) as HTMLSelectElement
        expect(roleSelect.value).toBe('member')
        expect(typeSelect.value).toBe('self')

        // change role to leader and submit
        await user.selectOptions(roleSelect, 'leader')

        const nameInput = screen.getByLabelText(/Profile Name/i)
        const submitButton = screen.getByRole('button', { name: /Create Profile/i })

        await user.type(nameInput, 'Leader Profile')

        // add a work to trigger upsert pathway
        await user.click(screen.getByRole('button', { name: /Mock Add/i }))

        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const formData = args[1] as FormData
            expect(formData.get('name')).toBe('Leader Profile')
            expect(formData.get('role')).toBe('leader')
            expect(formData.get('type')).toBe('self')
        })
    })

    it('shows organization confirmation inputs when role is leader and submits organizationName', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)

        render(<CreateProfileForm />)

        const roleSelect = screen.getByLabelText(/Role/i) as HTMLSelectElement
        await user.selectOptions(roleSelect, 'leader')

        // now the UI should show an organization name input/confirmation
        expect(screen.getByLabelText(/Organization Name/i)).toBeInTheDocument()

        const orgNameInput = screen.getByLabelText(/Organization Name/i)
        const nameInput = screen.getByLabelText(/Profile Name/i)
        const submitButton = screen.getByRole('button', { name: /Create Profile/i })

        await user.type(nameInput, 'Leader Profile B')
        await user.type(orgNameInput, "Leader's Org")

        await user.click(screen.getByRole('button', { name: /Mock Add/i }))
        await user.click(submitButton)

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const fd = args[1] as FormData
            expect(fd.get('role')).toBe('leader')
            expect(fd.get('organizationName')).toBe("Leader's Org")
        })
    })

    it('allows selecting values and includes them in submitted form data', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true, profileId: 'profile-values-client', organizationId: null } })

        render(<CreateProfileForm />)

        // select a couple of values
        const valueA = screen.getByLabelText(/Value A/i) as HTMLInputElement
        const valueB = screen.getByLabelText(/Value B/i) as HTMLInputElement

        await user.click(valueA)
        await user.click(valueB)

        const nameInput = screen.getByLabelText(/Profile Name/i)
        await user.type(nameInput, 'With Values')

        await user.click(screen.getByRole('button', { name: /Mock Add/i }))
        await user.click(screen.getByRole('button', { name: /Create Profile/i }))

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const fd = args[1] as FormData
            const valuesJson = fd.get('values') as string
            expect(valuesJson).not.toBeNull()
            const values = JSON.parse(valuesJson)
            expect(values).toEqual(expect.arrayContaining(['v-a', 'v-b']))
        })
    })

    it('allows selecting skills and includes them in submitted form data', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true, profileId: 'profile-skills-client', organizationId: null } })

        render(<CreateProfileForm />)

        // click skill checkboxes
        const skillA = screen.getByLabelText(/Skill A/i) as HTMLInputElement
        const skillB = screen.getByLabelText(/Skill B/i) as HTMLInputElement

        await user.click(skillA)
        await user.click(skillB)

        const nameInput = screen.getByLabelText(/Profile Name/i)
        await user.type(nameInput, 'With Skills')

        await user.click(screen.getByRole('button', { name: /Mock Add/i }))
        await user.click(screen.getByRole('button', { name: /Create Profile/i }))

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const fd = args[1] as FormData
            const skillsJson = fd.get('skills') as string
            expect(skillsJson).not.toBeNull()
            const skills = JSON.parse(skillsJson)
            expect(skills).toEqual(expect.arrayContaining(['s-a', 's-b']))
        })
    })

    // RED: Expect link input UI and that submitted formData includes links JSON
    it('renders link inputs and includes links in submitted form data', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true, profileId: 'profile-links-client', organizationId: null } })

        render(<CreateProfileForm />)

        // Expect a Link URL input to be present (component currently doesn't render this)
        expect(screen.getByLabelText(/Link URL/i)).not.toBeNull()

        // Fill in link inputs and submit — expecting createProfileAction to receive 'links' in FormData
        await user.type(screen.getByLabelText(/Profile Name/i), 'With Link')
        await user.type(screen.getByLabelText(/Link URL/i), 'https://example.com')
        await user.click(screen.getByRole('button', { name: /Create Profile/i }))

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const fd = args[1] as FormData
            const linksJson = fd.get('links') as string
            expect(linksJson).not.toBeNull()
            const links = JSON.parse(linksJson)
            expect(links).toEqual(expect.arrayContaining([{ url: 'https://example.com' }]))
        })
    })

    // RED: expect ability to add multiple links (UI currently only handles single link)
    it('allows adding multiple links and includes them in submitted form data', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)
        mockAction.mockResolvedValue({ success: true, data: { success: true, profileId: 'profile-multi-links-client', organizationId: null } })

        render(<CreateProfileForm />)

        // Should have an Add Link button (not implemented yet)
        expect(screen.getByRole('button', { name: /Add Link/i })).not.toBeNull()

        // Add two links via the UI and submit
        await user.click(screen.getByRole('button', { name: /Add Link/i }))
        await user.click(screen.getByRole('button', { name: /Add Link/i }))

        const linkInputs = screen.getAllByLabelText(/Link URL/i)
        expect(linkInputs.length).toBeGreaterThanOrEqual(2)

        await user.type(linkInputs[0], 'https://first.example')
        await user.type(linkInputs[1], 'https://second.example')

        await user.type(screen.getByLabelText(/Profile Name/i), 'Multi Link Profile')
        await user.click(screen.getByRole('button', { name: /Create Profile/i }))

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled()
            const args = mockAction.mock.calls[0]
            const fd = args[1] as FormData
            const linksJson = fd.get('links') as string
            expect(linksJson).not.toBeNull()
            const links = JSON.parse(linksJson)
            expect(links).toEqual(expect.arrayContaining([{ url: 'https://first.example' }, { url: 'https://second.example' }]))
        })
    })

    // RED: client-side validation — invalid link URL should prevent submit and show error
    it('shows validation error and does not call server action when a link URL is invalid', async () => {
        const user = userEvent.setup()
        const mockAction = vi.mocked(fetchLogic.createProfileAction)

        render(<CreateProfileForm />)

        // Add one link input
        await user.click(screen.getByRole('button', { name: /Add Link/i }))

        const linkInputs = screen.getAllByLabelText(/Link URL/i)
        expect(linkInputs.length).toBeGreaterThanOrEqual(1)

        // Enter invalid URL
        await user.type(linkInputs[0], 'not-a-valid-url')

        await user.type(screen.getByLabelText(/Profile Name/i), 'Invalid Link Profile')
        await user.click(screen.getByRole('button', { name: /Create Profile/i }))

        // We expect a validation error to appear and action NOT to be called
        await waitFor(() => {
            expect(screen.getByText(/invalid link url/i)).toBeInTheDocument()
            expect(mockAction).not.toHaveBeenCalled()
        })
    })
})

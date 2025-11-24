import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { CreateRootAccount } from './CreateRootAccount';
import * as fetchLogic from './CreateRootAccount.fetch';

// Mock the server action
vi.mock('./CreateRootAccount.fetch', () => ({
    createRootAccountAction: vi.fn(),
}));

describe('CreateRootAccount', () => {
    it('renders the form correctly', () => {
        render(<CreateRootAccount />);
        expect(screen.queryByLabelText(/Display Name/i)).not.toBeNull();
        expect(screen.queryByLabelText(/Location/i)).not.toBeNull();
        const submitButtons = screen.getAllByRole('button', { name: /Create Account/i });
        expect(submitButtons.length).toBeGreaterThan(0);
    });

    it('calls createRootAccountAction with correct data on submit', async () => {
        const user = userEvent.setup();
        const mockAction = vi.mocked(fetchLogic.createRootAccountAction);
        mockAction.mockResolvedValue({ success: true, message: 'Success' });

        render(<CreateRootAccount />);

        const nameInput = screen.getByLabelText(/Display Name/i);
        const locationInput = screen.getByLabelText(/Location/i);
        const submitButton = screen.getAllByRole('button', { name: /Create Account/i })[0];

        await user.type(nameInput, 'Test User');
        await user.type(locationInput, 'Tokyo');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockAction).toHaveBeenCalled();
            const args = mockAction.mock.calls[0];
            const formData = args[1] as FormData;
            expect(formData.get('displayName')).toBe('Test User');
            expect(formData.get('location')).toBe('Tokyo');
        });
    });
});

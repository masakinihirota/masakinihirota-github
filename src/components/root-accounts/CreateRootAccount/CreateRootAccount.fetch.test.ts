import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb'

// Prepare DB mock before importing module under test
const { insert } = setupDbMock({ insert: () => ({ values: vi.fn() }) })
import { createRootAccountAction } from './CreateRootAccount.fetch';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

vi.mock('@/db/schema', () => ({
  rootAccounts: {},
}));

describe('createRootAccountAction', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return validation errors for invalid input', async () => {
    const formData = new FormData();
    // Missing displayName

    const result = await createRootAccountAction({}, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Validation failed');
    expect(result.errors?.displayName).toBeDefined();
  });

  it('should return unauthorized if no user', async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const formData = new FormData();
    formData.append('displayName', 'Test User');

    const result = await createRootAccountAction({}, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Unauthorized');
  });

  it('should insert account and return success', async () => {
    const mockUser = { id: 'user-123' };
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } }),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any);

    const mockValues = vi.fn().mockResolvedValue(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mockInsert = vi.fn(() => ({ values: mockValues }));
    vi.mocked(db.insert).mockReturnValue({ values: mockValues } as any);

    const formData = new FormData();
    formData.append('displayName', 'Test User');
    formData.append('location', 'Tokyo');

    const result = await createRootAccountAction({}, formData);

    expect(result.success).toBe(true);
    expect(mockValues).toHaveBeenCalledWith({
      userId: 'user-123',
      displayName: 'Test User',
      location: 'Tokyo',
    });
  });
});

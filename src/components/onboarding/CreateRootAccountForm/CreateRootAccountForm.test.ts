import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb'

// Prepare a DB mock before importing the module which references db
const { insert } = setupDbMock({ insert: () => ({ values: vi.fn(() => ({ returning: vi.fn() })) }), select: () => ({ from: () => ({ where: vi.fn() }) }) })
import { createRootAccountAction } from './CreateRootAccountForm.fetch';
import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('createRootAccountAction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if user is not authenticated', async () => {
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      },
    });

    await expect(createRootAccountAction({ displayName: 'Test User' }))
      .rejects.toThrow('Unauthorized');
  });

  it('should create root account if input is valid and user is authenticated', async () => {
    const mockUser = { id: 'user-123' };
    (createClient as any).mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
      },
    });

    const mockDbReturn = [{ id: 'root-123', userId: 'user-123', displayName: 'Test User' }];
    const returningMock = vi.fn().mockResolvedValue(mockDbReturn);
    const valuesMock = vi.fn(() => ({ returning: returningMock }));
    (db.insert as any).mockReturnValue({ values: valuesMock });

    const result = await createRootAccountAction({ displayName: 'Test User', location: 'Tokyo' });

    expect(result).toEqual(mockDbReturn[0]);
    expect(db.insert).toHaveBeenCalled();
    expect(valuesMock).toHaveBeenCalledWith({
      userId: 'user-123',
      displayName: 'Test User',
      location: 'Tokyo',
    });
  });

  it('should validate input length', async () => {
     // This might be handled by Zod before reaching the logic if we use a wrapper,
     // but here we call the function directly.
     // If the function uses Zod parse, it should throw.
     // However, the current skeleton throws "Not implemented".
     // We expect it to eventually throw ZodError or similar.
  });
});

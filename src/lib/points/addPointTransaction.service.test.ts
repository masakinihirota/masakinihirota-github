/** @vitest-environment node */
import { describe, it, expect, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb';

// Set up DB mock BEFORE importing the module under test
const mockBalance = { rootAccountId: 'root-123', balance: 1000 };

const { select: mockSelect, insert: mockInsert } = setupDbMock({
  select: () => ({
    from: () => ({
      where: () => Promise.resolve([mockBalance]),
    }),
  }),
  insert: () => ({
    values: () => ({
      returning: async () => [{ id: 'tx-new', delta: -100 }],
    }),
  }),
});

// Mock for update - we'll need a custom implementation
let mockUpdateImplementation: any = {
  set: () => ({
    where: () => Promise.resolve([{ balance: 900 }]),
  }),
};

// Import after mock setup
import { addPointTransaction, AddPointTransactionInput } from './addPointTransaction.service';

describe('addPointTransaction service', () => {
  beforeEach(() => {
    mockSelect.mockClear();
    mockInsert.mockClear();
  });

  it('rejects transaction when balance would go negative', async () => {
    // Set up mock to return low balance
    setupDbMock({
      select: () => ({
        from: () => ({
          where: () => Promise.resolve([{ rootAccountId: 'root-123', balance: 50 }]),
        }),
      }),
    });

    const input: AddPointTransactionInput = {
      rootAccountId: 'root-123',
      delta: -100, // Try to deduct 100 from balance of 50
      reason: 'テスト減算',
    };

    const result = await addPointTransaction(input);

    expect(result.success).toBe(false);
    expect(result.error).toContain('残高不足');
  });
});

/** @vitest-environment node */
import { describe, it, expect, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb';

// Set up DB mock BEFORE importing the module under test
const mockSelectResult = [
  {
    id: 'tx-1',
    rootAccountId: 'root-123',
    delta: 1000,
    reason: '日次回復',
    relatedEntity: null,
    relatedId: null,
    createdAt: new Date('2025-12-01T10:00:00Z'),
  },
  {
    id: 'tx-2',
    rootAccountId: 'root-123',
    delta: -50,
    reason: '拍手',
    relatedEntity: 'work',
    relatedId: 'work-456',
    createdAt: new Date('2025-12-01T11:00:00Z'),
  },
];

const { select: mockSelect } = setupDbMock({
  select: () => ({
    from: () => ({
      where: () => ({
        orderBy: () => Promise.resolve(mockSelectResult),
      }),
    }),
  }),
});

// Now import the module under test (after mock setup)
import { getPointHistory } from './getPointHistory.service';

describe('getPointHistory service', () => {
  beforeEach(() => {
    mockSelect.mockClear();
  });

  it('returns point transaction history for a root account', async () => {
    const result = await getPointHistory('root-123');

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.length).toBe(2);
    expect(result.data?.[0].delta).toBe(1000);
    expect(result.data?.[0].reason).toBe('日次回復');
    expect(result.data?.[1].delta).toBe(-50);
    expect(result.data?.[1].reason).toBe('拍手');
  });
});

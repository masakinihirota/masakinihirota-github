/** @vitest-environment node */
import { describe, it, expect, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb';

// Set up DB mock BEFORE importing the module under test
const mockSelectResult = [
  { id: '123e4567-e89b-12d3-a456-426614174000', name: 'テスト組織1', description: '説明1' },
  { id: '223e4567-e89b-12d3-a456-426614174001', name: 'テスト組織2', description: '説明2' },
];

const { select: mockSelect } = setupDbMock({
  select: () => ({
    from: () => Promise.resolve(mockSelectResult),
  }),
});

// Now import the module under test (after mock setup)
import { getOrganizations } from './getOrganizations.service';

describe('getOrganizations service', () => {
  beforeEach(() => {
    mockSelect.mockClear();
  });

  it('returns a list of organizations', async () => {
    const result = await getOrganizations();

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.length).toBe(2);
    expect(result.data?.[0].name).toBe('テスト組織1');
  });
});

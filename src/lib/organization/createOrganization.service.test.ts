/** @vitest-environment node */
import { describe, it, expect, beforeEach } from 'vitest';
import { setupDbMock } from '@/tests/setup/mockDb';

// Set up DB mock BEFORE importing the module under test
const mockInsertResult = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'テスト組織',
  description: 'テスト用の組織です',
};

const { insert: mockInsert } = setupDbMock({
  insert: () => ({
    values: () => ({
      returning: async () => [mockInsertResult],
    }),
  }),
});

// Now import the module under test (after mock setup)
import { createOrganization, CreateOrganizationData } from './createOrganization.service';

describe('createOrganization service', () => {
  beforeEach(() => {
    mockInsert.mockClear();
  });

  it('creates an organization and returns the created record with id', async () => {
    const input: CreateOrganizationData = {
      name: 'テスト組織',
      description: 'テスト用の組織です',
    };

    const result = await createOrganization(input);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    expect(result.data?.name).toBe('テスト組織');
    expect(mockInsert).toHaveBeenCalled();
  });
});

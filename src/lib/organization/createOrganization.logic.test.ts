/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { validateOrganizationInput, CreateOrganizationInput } from './createOrganization.logic';

describe('Organization creation validation', () => {
  it('returns valid=false and error when name is empty', () => {
    const input: CreateOrganizationInput = {
      name: '',
      orgId: 'test-org',
      type: 'community',
    };

    const result = validateOrganizationInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.name).toContain('必須');
  });

  it('returns valid=false and error when orgId is empty', () => {
    const input: CreateOrganizationInput = {
      name: 'Test Org',
      orgId: '',
      type: 'community',
    };

    const result = validateOrganizationInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors.orgId).toBeDefined();
    expect(result.errors.orgId).toContain('必須');
  });

  it('returns valid=false and error when type is empty', () => {
    const input: CreateOrganizationInput = {
      name: 'Test Org',
      orgId: 'test-org',
      type: '',
    };

    const result = validateOrganizationInput(input);

    expect(result.valid).toBe(false);
    expect(result.errors.type).toBeDefined();
    expect(result.errors.type).toContain('必須');
  });

  it('returns valid=true when all required fields are provided', () => {
    const input: CreateOrganizationInput = {
      name: 'Test Org',
      orgId: 'test-org',
      type: 'community',
    };

    const result = validateOrganizationInput(input);

    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});

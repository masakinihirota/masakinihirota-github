import { describe, it, expect } from 'vitest';
import { transformFormData, initialState } from './CreateRootAccount.logic';

describe('CreateRootAccount.logic', () => {
  it('initialState shape is correct', () => {
    expect(initialState).toHaveProperty('success');
    expect(initialState).toHaveProperty('message');
    expect(initialState).toHaveProperty('errors');
  });

  it('transformFormData extracts displayName and optional location', () => {
    const fd = new FormData();
    fd.append('displayName', 'Alice');
    fd.append('location', 'Osaka');

    const result = transformFormData(fd);
    expect(result.displayName).toBe('Alice');
    expect(result.location).toBe('Osaka');
  });

  it('transformFormData returns undefined for missing optional fields', () => {
    const fd = new FormData();
    fd.append('displayName', 'Bob');

    const result = transformFormData(fd);
    expect(result.displayName).toBe('Bob');
    expect(result.location).toBeUndefined();
  });
});

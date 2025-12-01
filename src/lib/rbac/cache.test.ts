import { describe, it, expect } from 'vitest';
import { computeCacheEntries } from './cache';
import { Grant } from './index';

describe('RBAC Cache - computeCacheEntries', () => {
  it('AC-U-010: initial computation generates entries for actions', () => {
    const grants: Grant[] = [
      { source: 'role', id: 'R1', action: 'read:foo', allowed: true },
      { source: 'role', id: 'R1', action: 'write:foo', allowed: false },
    ];

    const entries = computeCacheEntries('user-1', grants);
    expect(entries.length).toBe(2);
    const read = entries.find((e) => e.action === 'read:foo');
    const write = entries.find((e) => e.action === 'write:foo');
    expect(read?.allowed).toBe(true);
    expect(write?.allowed).toBe(false);
    expect(read?.computedAt).toBeInstanceOf(Date);
  });

  it('AC-U-011 / AC-U-012: TTL set and invalidation hint via expiresAt', () => {
    const grants: Grant[] = [
      { source: 'role', id: 'R1', action: 'delete:bar', allowed: true },
    ];
    const entries = computeCacheEntries('user-2', grants, 2); // TTL 2s
    expect(entries[0].expiresAt).toBeInstanceOf(Date);
    // expiry should be ~ now + 2s
    const diff = (entries[0].expiresAt!.getTime() - entries[0].computedAt.getTime());
    expect(diff).toBeGreaterThanOrEqual(1990);
    expect(diff).toBeLessThanOrEqual(2100);
  });
});

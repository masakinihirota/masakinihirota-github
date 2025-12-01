import { describe, it, expect } from 'vitest';
import { computeMergedPermissions, evaluatePermission, Grant } from './index';

describe('RBAC computeMergedPermissions — deny precedence', () => {
  it('AC-U-001: single role allow => allowed true', () => {
    const grants: Grant[] = [
      { source: 'role', id: 'R1', action: 'read:resource', allowed: true, reason: 'R1 allows read' },
    ];

    const res = computeMergedPermissions('read:resource', grants);
    expect(res.allowed).toBe(true);
    expect(res.allowSources.length).toBe(1);
    expect(res.deniedSources.length).toBe(0);
  });

  it('AC-U-004: allow + deny exists -> deny wins', () => {
    const grants: Grant[] = [
      { source: 'role', id: 'R5', action: 'edit:resource', allowed: true },
      { source: 'role', id: 'R7', action: 'edit:resource', allowed: false, reason: 'R7 denies modification' },
    ];

    const res = evaluatePermission('edit:resource', grants);
    expect(res.allowed).toBe(false);
    expect(res.deniedSources.length).toBe(1);
  });

  it('AC-U-006: exception grant single -> allow', () => {
    const grants: Grant[] = [
      { source: 'exception', id: 'eg-001', action: 'delete:resource', allowed: true },
    ];
    const res = computeMergedPermissions('delete:resource', grants);
    expect(res.allowed).toBe(true);
    expect(res.allowSources.length).toBe(1);
  });

  it('AC-U-007: exception grant + deny -> deny still wins', () => {
    const grants: Grant[] = [
      { source: 'exception', id: 'eg-010', action: 'delete:resource', allowed: true },
      { source: 'role', id: 'R4', action: 'delete:resource', allowed: false },
    ];
    const res = evaluatePermission('delete:resource', grants);
    expect(res.allowed).toBe(false);
    expect(res.deniedSources.length).toBeGreaterThan(0);
  });
});

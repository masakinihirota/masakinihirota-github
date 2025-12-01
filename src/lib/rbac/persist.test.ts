import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { userAuthorizationPermissions, users, rootAccounts } from '@/db/schema';
import { refreshUserAuthorizationCache, clearExpiredCacheEntries } from './persist';
import { Grant } from './index';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL);

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('RBAC persist tests (skipped - no DB)', () => {});
} else {

describe('RBAC cache persistence', () => {
  it('inserts computed entries into user_authorization_permissions and replaces on refresh', async () => {
    const userId = randomUUID();
    // ensure user exists (for FK-free table but keep consistent)
    await db.insert(users).values({ id: userId, email: `${userId}@test` }).returning();
    await db.insert(rootAccounts).values({ userId, displayName: 'persist-test' }).returning();

    const grants: Grant[] = [
      { source: 'role', id: 'R1', action: 'read:res', allowed: true },
      { source: 'role', id: 'R1', action: 'edit:res', allowed: false },
    ];

    const inserted = await refreshUserAuthorizationCache(userId, grants, 60);
    expect(inserted).toBeGreaterThanOrEqual(2);

    const rows = await db.select().from(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
    expect(rows.length).toBeGreaterThanOrEqual(2);

    // Refresh with smaller set
    const grants2: Grant[] = [ { source: 'role', id: 'R1', action: 'read:res', allowed: true } ];
    const inserted2 = await refreshUserAuthorizationCache(userId, grants2, 30);
    expect(inserted2).toBe(1);

    const rows2 = await db.select().from(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
    expect(rows2.length).toBe(1);

    // Cleanup
    await db.delete(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
    await db.delete(rootAccounts).where(eq(rootAccounts.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('clearExpiredCacheEntries deletes expired rows', async () => {
    const userId = randomUUID();
    // create some rows with past expiresAt
    await db.insert(userAuthorizationPermissions).values({ userId, action: 'x:1', allowed: true, computedAt: new Date(), expiresAt: new Date(Date.now() - 10000) }).returning();
    await db.insert(userAuthorizationPermissions).values({ userId, action: 'x:2', allowed: true, computedAt: new Date(), expiresAt: new Date(Date.now() + 100000) }).returning();

    const before = await db.select().from(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
    expect(before.length).toBeGreaterThanOrEqual(2);

    await clearExpiredCacheEntries();

    const after = await db.select().from(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
    // only the non-expired entry should remain
    expect(after.length).toBe(1);

    // cleanup
    await db.delete(userAuthorizationPermissions).where(eq(userAuthorizationPermissions.userId, userId));
  });
});

}

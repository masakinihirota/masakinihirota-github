import { db } from '@/lib/db';
import { userAuthorizationPermissions } from '@/db/schema';
import { computeCacheEntries, CacheEntry } from './cache';
import { sql } from 'drizzle-orm';

/**
 * Refresh the user_authorization_permissions cache for a given user.
 * - Compute cache entries from provided grants (use computeCacheEntries)
 * - Upsert (replace) existing entries for that user atomically
 * - TTL is expressed in seconds (optional)
 */
export async function refreshUserAuthorizationCache(userId: string, grants: any[], ttlSeconds?: number) {
  const entries = computeCacheEntries(userId, grants, ttlSeconds);

  return db.transaction(async (tx) => {
    // Simple replace strategy: delete existing rows for user then insert
    await tx.delete(userAuthorizationPermissions).where(sql`${userAuthorizationPermissions.userId} = ${userId}`);

    if (entries.length === 0) return 0;

    const values = entries.map((e) => ({
      userId: e.userId,
      resourceId: null,
      resourceType: null,
      action: e.action,
      allowed: e.allowed,
      contextId: null,
      expiresAt: e.expiresAt ?? null,
      computedAt: e.computedAt,
    }));

    const inserted = await tx.insert(userAuthorizationPermissions).values(values).returning();
    return inserted.length;
  });
}

/**
 * Clear expired cache entries (or all for a user when userId provided)
 */
export async function clearExpiredCacheEntries(userId?: string) {
  if (userId) {
    return db.delete(userAuthorizationPermissions).where(sql`${userAuthorizationPermissions.userId} = ${userId}`);
  }

  // delete entries where expiresAt is in past
  return db.delete(userAuthorizationPermissions).where(sql`${userAuthorizationPermissions.expiresAt} < now()`);
}

export default { refreshUserAuthorizationCache, clearExpiredCacheEntries };

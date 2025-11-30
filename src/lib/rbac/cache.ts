import { Grant, computeMergedPermissions } from './index';

export type CacheEntry = {
  userId: string;
  resourceId?: string | null;
  action: string;
  allowed: boolean;
  computedAt: Date;
  expiresAt?: Date | null;
};

/**
 * Compute a set of cache entries for a user based on grants.
 * This is intentionally stateless: it returns what *should* be stored in
 * user_authorization_permissions for the given grants. TTL (in seconds) optional.
 */
export function computeCacheEntries(userId: string, grants: Grant[], ttlSeconds?: number): CacheEntry[] {
  // group grants by action
  const actions = new Set(grants.map((g) => g.action));

  const now = new Date();
  return Array.from(actions).map((action) => {
    const merged = computeMergedPermissions(action, grants);
    const expiresAt = typeof ttlSeconds === 'number' ? new Date(now.getTime() + ttlSeconds * 1000) : null;
    return {
      userId,
      resourceId: null,
      action: merged.action,
      allowed: merged.allowed,
      computedAt: now,
      expiresAt,
    } as CacheEntry;
  });
}

export default { computeCacheEntries };

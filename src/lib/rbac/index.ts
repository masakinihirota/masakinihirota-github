export type Grant = {
  source: 'role' | 'exception' | 'system';
  id?: string; // role code or exception id
  action: string;
  allowed: boolean;
  reason?: string;
};

export type MergeResult = {
  action: string;
  allowed: boolean;
  deniedSources: Grant[];
  allowSources: Grant[];
};

/**
 * Merge an array of grants for a single action.
 * Deny precedence: if any grant denies the action, final result is deny.
 */
export function computeMergedPermissions(action: string, grants: Grant[]): MergeResult {
  const deniedSources = grants.filter((g) => g.action === action && g.allowed === false);
  const allowSources = grants.filter((g) => g.action === action && g.allowed === true);

  const allowed = deniedSources.length === 0 && allowSources.length > 0;

  return { action, allowed, deniedSources, allowSources };
}

/**
 * High level permission evaluation for a given user/context/action.
 * For the purposes of initial unit tests we accept prepared grants.
 */
export function evaluatePermission(action: string, grants: Grant[]): MergeResult {
  return computeMergedPermissions(action, grants);
}

export default { computeMergedPermissions, evaluatePermission };

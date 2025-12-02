import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rbacService } from './rbac.service';
import { db } from '@/lib/db';
import { users, aclRoles, aclPermissions, aclRolePermissions, userSystemRoles, organizations, organizationMembers, rootAccounts, profiles, aclExceptionGrants } from '@/db/schema';
import { registerCleanup } from '@/tests/setup/cleanup';
import { ACL_ROLES, ACL_PERMISSIONS } from '@/constants/rbac';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL);

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('RbacService (skipped - no DB)', () => {});
} else {

describe('RbacService', () => {
  let testUserId: string;
  let testEmail: string;
  let localRoleId: string;
  let localPermId: string;
  let localRootAccountId: string | null = null;
  let localProfileId: string | null = null;
  let localOrganizationId: string | null = null;

  beforeEach(async () => {
    // Setup: Create a per-test user (isolation)
    testUserId = randomUUID();
    testEmail = `test-${testUserId}@example.com`;
    await db.insert(users).values({ id: testUserId, email: testEmail });
    registerCleanup(async () => {
      await db.delete(users).where(eq(users.id, testUserId)).catch(() => {});
    });

    // Setup: Use unique role/permission ids for test isolation
    localPermId = `${ACL_PERMISSIONS.SYSTEM_MANAGE}-test-${randomUUID()}`;
    localRoleId = `role_test_${randomUUID()}`;

    await db.insert(aclPermissions).values({
      id: localPermId,
      category: 'system'
    }).onConflictDoNothing();
    registerCleanup(async () => {
      await db.delete(aclPermissions).where(eq(aclPermissions.id, localPermId)).catch(() => {});
    });

    await db.insert(aclRoles).values({
      id: localRoleId,
      name: 'Sys Admin (test)',
      scope: 'system'
    }).onConflictDoNothing();
    registerCleanup(async () => {
      await db.delete(aclRoles).where(eq(aclRoles.id, localRoleId)).catch(() => {});
    });

    // Assign permission to role (local)
    await db.insert(aclRolePermissions).values({
      roleId: localRoleId,
      permissionId: localPermId
    }).onConflictDoNothing();
    registerCleanup(async () => {
      await db.delete(aclRolePermissions).where(eq(aclRolePermissions.roleId, localRoleId)).catch(() => {});
    });
  });

  afterEach(async () => {
    // cleanup handled centrally by test registry (vitest.setup.ts)
  });

  it('should return false if user has no roles', async () => {
    try {
      const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any);
      expect(hasPerm).toBe(false);
    } catch (e) {
      console.error('Test failed with error:', e);
      throw e;
    }
  });

  it('should return true if user has system role with permission', async () => {
    // Assign role
    await rbacService.assignSystemRole(testUserId, localRoleId as any);

    const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any);
    expect(hasPerm).toBe(true);
  });

  it('should return false if user has role but not the specific permission', async () => {
    // Create a dummy role without permissions
    const dummyRole = 'dummy_role';
    await db.insert(aclRoles).values({ id: dummyRole, name: 'Dummy', scope: 'system' }).onConflictDoNothing();
    await rbacService.assignSystemRole(testUserId, dummyRole as any);

    const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any);
    expect(hasPerm).toBe(false);

    // Cleanup dummy role
    await db.delete(aclRoles).where(eq(aclRoles.id, dummyRole));
  });

  it('should respect deny exception overriding role permissions', async () => {
    // Create root account and profile for the user
    localRootAccountId = randomUUID();
    await db.insert(rootAccounts).values({ id: localRootAccountId, userId: testUserId, displayName: 'test root' });
    localProfileId = randomUUID();
    await db.insert(profiles).values({ id: localProfileId, rootAccountId: localRootAccountId, name: 'test profile' });

    // Create a deny exception for the profile
    await db.insert(aclExceptionGrants).values({ id: randomUUID(), profileId: localProfileId, permissionId: localPermId, isDeny: true }).onConflictDoNothing();

    // Assign role with the permission to the user
    await rbacService.assignSystemRole(testUserId, localRoleId as any);

    // Permission should be denied because exception deny overrides role
    const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any);
    expect(hasPerm).toBe(false);
  });

  it('should respect allow exception even without a role', async () => {
    // Create root account and profile for the user
    localRootAccountId = randomUUID();
    await db.insert(rootAccounts).values({ id: localRootAccountId, userId: testUserId, displayName: 'test root' });
    localProfileId = randomUUID();
    await db.insert(profiles).values({ id: localProfileId, rootAccountId: localRootAccountId, name: 'test profile' });

    // Create an allow exception for the profile (isDeny=false)
    await db.insert(aclExceptionGrants).values({ id: randomUUID(), profileId: localProfileId, permissionId: localPermId, isDeny: false }).onConflictDoNothing();

    // User has no role — expect allow due to exception grant
    const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any);
    expect(hasPerm).toBe(true);
  });

  it('should return true for organization context when profile has org role with permission', async () => {
    // Create root account and profile for the user
    localRootAccountId = randomUUID();
    await db.insert(rootAccounts).values({ id: localRootAccountId, userId: testUserId, displayName: 'org root' });
    localProfileId = randomUUID();
    await db.insert(profiles).values({ id: localProfileId, rootAccountId: localRootAccountId, name: 'org profile' });

    // create an organization and assign the profile a role
    localOrganizationId = randomUUID();
    await db.insert(organizations).values({ id: localOrganizationId, name: 'Test Org' }).onConflictDoNothing();
    await db.insert(organizationMembers).values({ organizationId: localOrganizationId, profileId: localProfileId, roleId: localRoleId }).onConflictDoNothing();

    // Since localRoleId has localPermId assigned, and the profile has that role for the org, permission should be true
    const hasPerm = await rbacService.hasPermission(testUserId, localPermId as any, { organizationId: localOrganizationId });
    expect(hasPerm).toBe(true);
  });

  // resource-scoped exception test moved to dedicated unit test that uses mocks
});

}

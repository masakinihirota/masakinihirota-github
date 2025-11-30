import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { rbacService } from './rbac.service';
import { db } from '@/lib/db';
import { users, aclRoles, aclPermissions, aclRolePermissions, userSystemRoles } from '@/db/schema';
import { ACL_ROLES, ACL_PERMISSIONS } from '@/constants/rbac';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

describe('RbacService', () => {
  const testUserId = randomUUID();
  const testEmail = `test-${testUserId}@example.com`;

  beforeEach(async () => {
    // Setup: Create user
    await db.insert(users).values({ id: testUserId, email: testEmail });

    // Setup: Ensure roles and permissions exist (using the ones we defined in constants)
    await db.insert(aclPermissions).values({
      id: ACL_PERMISSIONS.SYSTEM_MANAGE,
      category: 'system'
    }).onConflictDoNothing();

    await db.insert(aclRoles).values({
      id: ACL_ROLES.SYS_ADMIN,
      name: 'Sys Admin',
      scope: 'system'
    }).onConflictDoNothing();

    // Assign permission to role
    await db.insert(aclRolePermissions).values({
      roleId: ACL_ROLES.SYS_ADMIN,
      permissionId: ACL_PERMISSIONS.SYSTEM_MANAGE
    }).onConflictDoNothing();
  });

  afterEach(async () => {
    // Cleanup
    await db.delete(userSystemRoles).where(eq(userSystemRoles.userId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it('should return false if user has no roles', async () => {
    try {
      const hasPerm = await rbacService.hasPermission(testUserId, ACL_PERMISSIONS.SYSTEM_MANAGE);
      expect(hasPerm).toBe(false);
    } catch (e) {
      console.error('Test failed with error:', e);
      throw e;
    }
  });

  it('should return true if user has system role with permission', async () => {
    // Assign role
    await rbacService.assignSystemRole(testUserId, ACL_ROLES.SYS_ADMIN);

    const hasPerm = await rbacService.hasPermission(testUserId, ACL_PERMISSIONS.SYSTEM_MANAGE);
    expect(hasPerm).toBe(true);
  });

  it('should return false if user has role but not the specific permission', async () => {
    // Create a dummy role without permissions
    const dummyRole = 'dummy_role';
    await db.insert(aclRoles).values({ id: dummyRole, name: 'Dummy', scope: 'system' }).onConflictDoNothing();
    await rbacService.assignSystemRole(testUserId, dummyRole as any);

    const hasPerm = await rbacService.hasPermission(testUserId, ACL_PERMISSIONS.SYSTEM_MANAGE);
    expect(hasPerm).toBe(false);

    // Cleanup dummy role
    await db.delete(aclRoles).where(eq(aclRoles.id, dummyRole));
  });
});

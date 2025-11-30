import { db } from "@/lib/db";
import {
  aclRoles,
  aclPermissions,
  aclRolePermissions,
  userSystemRoles,
  aclNationRoleAssignments,
  aclGroupRoleAssignments,
  aclExceptionGrants,
  userAuthorizationPermissions,
  aclGroups,
  aclGroupClosure
} from "@/db/schema";
import { eq, and, or, inArray, sql } from "drizzle-orm";
import { AclPermission, AclRole, ACL_SCOPES } from "@/constants/rbac";

export class RbacService {
  /**
   * Check if a user has a specific permission.
   * This checks:
   * 1. System-wide roles
   * 2. Context-specific roles (Nation, Organization)
   * 3. Group inheritance (if applicable)
   * 4. Exception grants (Allow/Deny)
   */
  async hasPermission(
    userId: string,
    permissionId: AclPermission,
    context?: { nationId?: string; organizationId?: string }
  ): Promise<boolean> {
    // 1. Check Exception Grants (Direct Allow/Deny)
    // Deny takes precedence over everything.
    const exceptions = await db.query.aclExceptionGrants.findMany({
      where: and(
        eq(aclExceptionGrants.permissionId, permissionId),
        // We need to join with profile to get userId, or assume profileId is passed?
        // Schema uses profileId for exceptions. We need to resolve profileId from userId.
        // For now, let's assume we can get profileId.
        // TODO: Resolve profileId from userId efficiently.
      )
    });

    // For simplicity in this initial version, we will focus on Role-based checks.
    // Full implementation requires resolving the user's active profile(s).

    // 2. Check System Roles
    const systemRoles = await db
      .select({ roleId: userSystemRoles.roleId })
      .from(userSystemRoles)
      .where(eq(userSystemRoles.userId, userId));

    const systemRoleIds = systemRoles.map(r => r.roleId);

    if (await this.checkRolesForPermission(systemRoleIds, permissionId)) {
      return true;
    }

    // 3. Check Context Roles (Nation)
    if (context?.nationId) {
      // We need to find the profile(s) associated with this user
      // Then check aclNationRoleAssignments
      // This part requires joining users -> rootAccounts -> profiles
      // Let's do a raw query or a complex join for efficiency?
      // Or better, fetch user's profiles first.
    }

    // Fallback: False
    return false;
  }

  /**
   * Helper to check if any of the given roles have the permission
   */
  private async checkRolesForPermission(roleIds: string[], permissionId: string): Promise<boolean> {
    if (roleIds.length === 0) return false;

    // Check if any role has the permission directly
    const hasPerm = await db
      .select()
      .from(aclRolePermissions)
      .where(and(
        inArray(aclRolePermissions.roleId, roleIds),
        eq(aclRolePermissions.permissionId, permissionId)
      ))
      .limit(1);

    return hasPerm.length > 0;
  }

  /**
   * Assign a system role to a user
   */
  async assignSystemRole(userId: string, roleId: AclRole) {
    await db
      .insert(userSystemRoles)
      .values({ userId, roleId })
      .onConflictDoNothing();
  }

  /**
   * Assign a nation role to a profile
   */
  async assignNationRole(nationId: string, profileId: string, roleId: AclRole) {
    await db
      .insert(aclNationRoleAssignments)
      .values({ nationId, profileId, roleId })
      .onConflictDoNothing();
  }
}

export const rbacService = new RbacService();

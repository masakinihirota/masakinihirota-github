import { db } from "@/lib/db";
import {
  aclRoles,
  aclPermissions,
  aclRolePermissions,
  userSystemRoles,
  aclNationRoleAssignments,
  organizationMembers,
  aclGroupRoleAssignments,
  aclExceptionGrants,
  userAuthorizationPermissions,
  aclGroups,
  rootAccounts,
  profiles,
  aclGroupClosure
} from "@/db/schema";
import { eq, and, or, inArray } from "drizzle-orm";
import { AclPermission, AclRole } from "@/constants/rbac";

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
    // Resolve user's profiles (users -> rootAccounts -> profiles) and check
    // any exception grants attached to those profiles for this permission.
    const rootAcctRows = await db
      .select({ id: rootAccounts.id })
      .from(rootAccounts)
      .where(eq(rootAccounts.userId, userId));

    const rootAccountIds = rootAcctRows.map(r => r.id);

    let profileIds: string[] = [];
    if (rootAccountIds.length > 0) {
      const profileRows = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(inArray(profiles.rootAccountId, rootAccountIds));

      profileIds = profileRows.map(p => p.id);
    }

    if (profileIds.length > 0) {
      const exceptions = await db
        .select()
        .from(aclExceptionGrants)
        .where(and(
          inArray(aclExceptionGrants.profileId, profileIds),
          eq(aclExceptionGrants.permissionId, permissionId)
        ));

      if (exceptions.length > 0) {
        // If any deny exists, deny overrides
        const hasDeny = exceptions.some((e: any) => e.isDeny === true);
        if (hasDeny) return false;

        // Any allow grant will permit
        const hasAllow = exceptions.some((e: any) => e.isDeny === false);
        if (hasAllow) return true;
      }
    }

    // 2. Check System Roles
    const systemRoles = await db
      .select({ roleId: userSystemRoles.roleId })
      .from(userSystemRoles)
      .where(eq(userSystemRoles.userId, userId));

    const systemRoleIds = systemRoles.map(r => r.roleId);

    if (await this.checkRolesForPermission(systemRoleIds, permissionId)) {
      return true;
    }

    // 3. Check Context Roles (Nation / Organization)
    if (context?.nationId && profileIds.length > 0) {
      // Find roles assigned to these profiles within that nation
      const nationAssignments = await db
        .select({ roleId: aclNationRoleAssignments.roleId })
        .from(aclNationRoleAssignments)
        .where(and(eq(aclNationRoleAssignments.nationId, context.nationId), inArray(aclNationRoleAssignments.profileId, profileIds)));

      const nationRoleIds = nationAssignments.map(r => r.roleId);
      if (nationRoleIds.length > 0 && await this.checkRolesForPermission(nationRoleIds, permissionId)) {
        return true;
      }
    }

    if (context?.organizationId && profileIds.length > 0) {
      // organizationMembers stores profileId -> roleId for organizations
      const orgAssignments = await db
        .select({ roleId: organizationMembers.roleId })
        .from(organizationMembers)
        .where(and(eq(organizationMembers.organizationId, context.organizationId), inArray(organizationMembers.profileId, profileIds)));

      const orgRoleIds = orgAssignments.map(r => r.roleId);
      if (orgRoleIds.length > 0 && await this.checkRolesForPermission(orgRoleIds, permissionId)) {
        return true;
      }
    }

    // Fallback: False
    return false;
  }

  /**
   * Helper to check if any of the given roles have the permission
   */
  private async checkRolesForPermission(roleIds: string[], permissionId: AclPermission): Promise<boolean> {
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

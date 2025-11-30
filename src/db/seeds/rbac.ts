import { db } from "@/lib/db";
import { aclPermissions, aclRoles, aclRolePermissions } from "@/db/schema";
import { ACL_PERMISSIONS, ACL_ROLES, ROLE_DEFINITIONS, type AclRole } from "@/constants/rbac";
import { eq } from "drizzle-orm";

export async function seedRBAC() {
  console.log("🌱 Seeding RBAC...");

  // 1. Seed Permissions
  const permissionsData = Object.values(ACL_PERMISSIONS).map((permId) => ({
    id: permId,
    category: permId.split('.')[0], // 'system', 'nation', etc.
    description: `Permission for ${permId}`,
  }));

  console.log(`   - Inserting ${permissionsData.length} permissions...`);
  await db
    .insert(aclPermissions)
    .values(permissionsData)
    .onConflictDoNothing();

  // 2. Seed Roles
  const rolesData = (Object.values(ACL_ROLES) as AclRole[])
    .map((roleId) => {
      const def = ROLE_DEFINITIONS[roleId];
      if (!def) {
        console.warn(`Skipping role seed: ROLE_DEFINITIONS[${roleId}] not found`);
        return null;
      }

      return {
        id: roleId,
        name: def.name,
        scope: def.scope,
        description: def.description,
      };
    })
    .filter(Boolean) as { id: string; name: string; scope: string; description: string }[];

  console.log(`   - Inserting ${rolesData.length} roles...`);
  await db
    .insert(aclRoles)
    .values(rolesData)
    .onConflictDoNothing();

  // 3. Seed Role-Permission Assignments
  console.log("   - Assigning permissions to roles...");
  for (const roleId of Object.values(ACL_ROLES) as AclRole[]) {
    const def = ROLE_DEFINITIONS[roleId];
    if (!def) continue;
    if (!Array.isArray(def.permissions) || def.permissions.length === 0) continue;
      const values = def.permissions.map((permId) => ({
        roleId: roleId,
        permissionId: permId,
      }));

        await db
          .insert(aclRolePermissions)
          .values(values)
          .onConflictDoNothing();
      }

  console.log("✅ RBAC Seeding completed.");
}

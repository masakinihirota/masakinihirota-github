export const ACL_SCOPES = {
  SYSTEM: 'system',
  ORGANIZATION: 'organization',
  NATION: 'nation',
} as const;

export type AclScope = typeof ACL_SCOPES[keyof typeof ACL_SCOPES];

export const ACL_ROLES = {
  // System Scopes
  SYS_ADMIN: 'sys_admin',
  SYS_OPERATOR: 'sys_operator',

  // Nation Scopes
  NATION_LEADER: 'nation_leader',
  NATION_OFFICER: 'nation_officer',
  NATION_CITIZEN: 'nation_citizen',

  // Organization Scopes
  ORG_LEADER: 'org_leader',
  ORG_OFFICER: 'org_officer',
  ORG_MEMBER: 'org_member',

  // General
  GENERAL_USER: 'general_user',
} as const;

export type AclRole = typeof ACL_ROLES[keyof typeof ACL_ROLES];

export const ACL_PERMISSIONS = {
  // System
  SYSTEM_MANAGE: 'system.manage',
  USERS_MANAGE: 'system.users.manage',

  // Nation
  NATION_CREATE: 'nation.create',
  NATION_UPDATE: 'nation.update',
  NATION_DELETE: 'nation.delete',
  NATION_INVITE: 'nation.invite',
  NATION_SETTINGS: 'nation.settings',

  // Organization
  ORG_CREATE: 'organization.create',
  ORG_UPDATE: 'organization.update',
  ORG_DELETE: 'organization.delete',
  ORG_INVITE: 'organization.invite',
  ORG_SETTINGS: 'organization.settings',

  // Content / Works
  WORK_CREATE: 'work.create',
  WORK_UPDATE: 'work.update',
  WORK_DELETE: 'work.delete',
  WORK_APPROVE: 'work.approve', // Admin only usually

  // Profile
  PROFILE_UPDATE: 'profile.update',
} as const;

export type AclPermission = typeof ACL_PERMISSIONS[keyof typeof ACL_PERMISSIONS];

export const ROLE_DEFINITIONS: Record<AclRole, { name: string; scope: AclScope; description: string; permissions: AclPermission[] }> = {
  [ACL_ROLES.SYS_ADMIN]: {
    name: 'System Administrator',
    scope: ACL_SCOPES.SYSTEM,
    description: 'Full access to all system resources',
    permissions: [
      ACL_PERMISSIONS.SYSTEM_MANAGE,
      ACL_PERMISSIONS.USERS_MANAGE,
      ACL_PERMISSIONS.WORK_APPROVE,
      // Inherits everything effectively via logic, but explicit listing helps
    ],
  },
  [ACL_ROLES.SYS_OPERATOR]: {
    name: 'System Operator',
    scope: ACL_SCOPES.SYSTEM,
    description: 'Operational access to system resources',
    permissions: [
      ACL_PERMISSIONS.USERS_MANAGE,
      ACL_PERMISSIONS.WORK_APPROVE,
    ],
  },
  [ACL_ROLES.NATION_LEADER]: {
    name: 'Nation Leader',
    scope: ACL_SCOPES.NATION,
    description: 'Leader of a nation',
    permissions: [
      ACL_PERMISSIONS.NATION_UPDATE,
      ACL_PERMISSIONS.NATION_DELETE,
      ACL_PERMISSIONS.NATION_INVITE,
      ACL_PERMISSIONS.NATION_SETTINGS,
    ],
  },
  [ACL_ROLES.NATION_OFFICER]: {
    name: 'Nation Officer',
    scope: ACL_SCOPES.NATION,
    description: 'Officer of a nation',
    permissions: [
      ACL_PERMISSIONS.NATION_INVITE,
      ACL_PERMISSIONS.NATION_SETTINGS,
    ],
  },
  [ACL_ROLES.NATION_CITIZEN]: {
    name: 'Nation Citizen',
    scope: ACL_SCOPES.NATION,
    description: 'Citizen of a nation',
    permissions: [],
  },
  [ACL_ROLES.ORG_LEADER]: {
    name: 'Organization Leader',
    scope: ACL_SCOPES.ORGANIZATION,
    description: 'Leader of an organization',
    permissions: [
      ACL_PERMISSIONS.ORG_UPDATE,
      ACL_PERMISSIONS.ORG_DELETE,
      ACL_PERMISSIONS.ORG_INVITE,
      ACL_PERMISSIONS.ORG_SETTINGS,
    ],
  },
  [ACL_ROLES.ORG_OFFICER]: {
    name: 'Organization Officer',
    scope: ACL_SCOPES.ORGANIZATION,
    description: 'Officer of an organization',
    permissions: [
      ACL_PERMISSIONS.ORG_INVITE,
      ACL_PERMISSIONS.ORG_SETTINGS,
    ],
  },
  [ACL_ROLES.ORG_MEMBER]: {
    name: 'Organization Member',
    scope: ACL_SCOPES.ORGANIZATION,
    description: 'Member of an organization',
    permissions: [],
  },
  [ACL_ROLES.GENERAL_USER]: {
    name: 'General User',
    scope: ACL_SCOPES.SYSTEM,
    description: 'Standard user',
    permissions: [
      ACL_PERMISSIONS.NATION_CREATE, // Depending on game rules
      ACL_PERMISSIONS.ORG_CREATE,
      ACL_PERMISSIONS.WORK_CREATE,
      ACL_PERMISSIONS.PROFILE_UPDATE,
    ],
  },
};

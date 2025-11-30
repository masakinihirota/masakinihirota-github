import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { users, rootAccounts, profiles, nations, aclRoles, aclNationRoleAssignments } from './schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL);

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('RLS nations tests (skipped - no DB)', () => {});
} else {

describe('Nations RLS policies', () => {
  it('AC-DB-001: nation leader/profile can SELECT their nation (RLS pass)', async () => {
    // Setup entities
    const userId = randomUUID();
    const email = `${userId}@example.test`;
    const u = await db.insert(users).values({ id: userId, email }).returning();
    const r = await db.insert(rootAccounts).values({ userId, displayName: 'ra-rls1' }).returning();
    const p = await db.insert(profiles).values({ rootAccountId: r[0].id, name: 'profile-rls1' }).returning();
    const roleKey = 'nation_leader';
    await db.insert(aclRoles).values({ id: roleKey, name: 'Nation Leader', scope: 'nation' }).onConflictDoNothing().returning();

    const n = await db.insert(nations).values({ name: 'N-Test-1' }).returning();
    await db.insert(aclNationRoleAssignments).values({ nationId: n[0].id, profileId: p[0].id, roleId: roleKey }).returning();

    try {
      const rows = await db.transaction(async (tx) => {
        // Set current profile for the session so the RLS policy sees the profile
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${p[0].id}::text, true)`);
        const res = await tx.select().from(nations).where(eq(nations.id, n[0].id));
        return res;
      });

      expect(rows.length).toBe(1);
      expect(rows[0].name).toBe('N-Test-1');
    } finally {
      // cleanup
      await db.delete(aclNationRoleAssignments).where(eq(aclNationRoleAssignments.nationId, n[0].id));
      await db.delete(nations).where(eq(nations.id, n[0].id));
      await db.delete(profiles).where(eq(profiles.id, p[0].id));
      await db.delete(rootAccounts).where(eq(rootAccounts.id, r[0].id));
      await db.delete(users).where(eq(users.id, userId));
    }
  });

  it('AC-DB-004: current_roles false-positive check should not grant sys_admin-like substring', async () => {
    // Setup: create a nation
    const [n] = await db.insert(nations).values({ name: 'N-FalseMatch' }).returning();
    const userId = randomUUID();
    const [u] = await db.insert(users).values({ id: userId, email: `${userId}@ex.test` }).returning();
    const [r] = await db.insert(rootAccounts).values({ userId, displayName: 'ra-false' }).returning();
    const [p] = await db.insert(profiles).values({ rootAccountId: r.id, name: 'profile-false' }).returning();

    try {
      const rows = await db.transaction(async (tx) => {
        // set a role that contains substring 'sys_admin' but isn't the role
        await tx.execute(sql`SELECT set_config('app.current_roles', '["not_sys_admin"]', true)`);
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${p.id}::text, true)`);
        const res = await tx.select().from(nations).where(eq(nations.id, n.id));
        return res;
      });

      expect(rows.length).toBe(0);
    } finally {
      await db.delete(nations).where(eq(nations.id, n.id));
      await db.delete(profiles).where(eq(profiles.id, p.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, r.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userId)).catch(()=>{});
    }
  });

  it('AC-DB-005: write policy — only sys_admin can INSERT nations', async () => {
    const userId = randomUUID();
    const [u] = await db.insert(users).values({ id: userId, email: `${userId}@ex.test` }).returning();
    const [r] = await db.insert(rootAccounts).values({ userId, displayName: 'ra-writer' }).returning();
    const [p] = await db.insert(profiles).values({ rootAccountId: r.id, name: 'profile-writer' }).returning();

    try {
      // non-admin should be denied when trying to insert
      await expect(db.transaction(async (tx) => {
        await tx.execute(sql`SELECT set_config('app.current_roles', '["not_sys_admin"]', true)`);
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${p.id}::text, true)`);
        return await tx.insert(nations).values({ name: 'N-Insert-Fail' }).returning();
      })).rejects.toThrow();

      // admin can insert
      const rows = await db.transaction(async (tx) => {
        await tx.execute(sql`SELECT set_config('app.current_roles', '["sys_admin"]', true)`);
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${p.id}::text, true)`);
        return await tx.insert(nations).values({ name: 'N-Insert-Success' }).returning();
      });
      expect(rows.length).toBeGreaterThanOrEqual(1);

      // cleanup inserted
      await db.delete(nations).where(eq(nations.name, 'N-Insert-Success'));
    } finally {
      await db.delete(profiles).where(eq(profiles.id, p.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, r.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userId)).catch(()=>{});
    }
  });

  it('AC-DB-002: profile without assignment cannot SELECT nation (RLS deny)', async () => {
    // Setup a nation and a different profile
    const userA = randomUUID();
    const userB = randomUUID();
    const [ua] = await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
    const [ra] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-a' }).returning();
    const [pa] = await db.insert(profiles).values({ rootAccountId: ra.id, name: 'profile-a' }).returning();

    const [ub] = await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
    const [rb] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-b' }).returning();
    const [pb] = await db.insert(profiles).values({ rootAccountId: rb.id, name: 'profile-b' }).returning();

    const [n] = await db.insert(nations).values({ name: 'N-Test-deny' }).returning();

    try {
      const rows = await db.transaction(async (tx) => {
        // Set current profile to B (no assignment linking to the nation)
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${pb.id}::text, true)`);
        const res = await tx.select().from(nations).where(eq(nations.id, n.id));
        return res;
      });

      expect(rows.length).toBe(0);
    } finally {
      await db.delete(nations).where(eq(nations.id, n.id));
      await db.delete(profiles).where(eq(profiles.id, pa.id)).catch(()=>{});
      await db.delete(profiles).where(eq(profiles.id, pb.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, ra.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rb.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
    }
  });

  it('AC-DB-003: sys_admin role bypass allows SELECT even without nation assignment', async () => {
    // Setup profile that is NOT a nation leader but we will set app.current_roles to include 'sys_admin'
    const userId = randomUUID();
    const email = `${userId}@example.test`;
    const u = await db.insert(users).values({ id: userId, email }).returning();
    const r = await db.insert(rootAccounts).values({ userId, displayName: 'ra-rls-sys' }).returning();
    const p = await db.insert(profiles).values({ rootAccountId: r[0].id, name: 'profile-sys' }).returning();
    const n = await db.insert(nations).values({ name: 'N-Sys-Bypass' }).returning();

    try {
      const rows = await db.transaction(async (tx) => {
        // Grant sys_admin via session variable (JSON array)
        await tx.execute(sql`SELECT set_config('app.current_roles', '["sys_admin"]', true)`);
        await tx.execute(sql`SELECT set_config('app.current_profile_id', ${p[0].id}::text, true)`);
        const res = await tx.select().from(nations).where(eq(nations.id, n[0].id));
        return res;
      });

      expect(rows.length).toBe(1);
    } finally {
      await db.delete(nations).where(eq(nations.id, n[0].id));
      await db.delete(profiles).where(eq(profiles.id, p[0].id));
      await db.delete(rootAccounts).where(eq(rootAccounts.id, r[0].id));
      await db.delete(users).where(eq(users.id, userId));
    }
  });
});

}

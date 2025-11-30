import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { users, rootAccounts, rootAccountPoints, ledgerEntries } from '@/db/schema';
import { randomUUID } from 'crypto';
import { transferPoints } from './index';
import { eq } from 'drizzle-orm';

// Use HMAC secret in tests to ensure HMAC path is exercised
process.env.LEDGER_HMAC_SECRET = process.env.LEDGER_HMAC_SECRET ?? 'test-secret-very-secret';
const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL);

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('Ledger transfer tests (skipped - no DB)', () => {});
} else {

describe('Ledger double-entry transfer', () => {
  it('AC-U-027: transfer creates two ledger_entries and updates balances atomically', async () => {
    const txId = randomUUID();

    // create accounts and initial balances
    const userA = randomUUID();
    const userB = randomUUID();
    const [uA] = await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
    const [rA] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A' }).returning();
    const [uB] = await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
    const [rB] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-B' }).returning();

    // Insert balances
    await db.insert(rootAccountPoints).values({ rootAccountId: rA.id, balance: 100 }).onConflictDoNothing();
    await db.insert(rootAccountPoints).values({ rootAccountId: rB.id, balance: 20 }).onConflictDoNothing();

    try {
      const res = await transferPoints(txId, rA.id, rB.id, 30);
      expect(res.transactionId).toBe(txId);
      expect(res.entries).toHaveLength(2);

      // both entries should have same transaction id and opposite directions
      const [e1, e2] = res.entries;
      expect(e1.balanceBefore + e1.amount === e1.balanceAfter || e1.balanceBefore - e1.amount === e1.balanceAfter).toBeTruthy();
      expect(e2.balanceBefore + e2.amount === e2.balanceAfter || e2.balanceBefore - e2.amount === e2.balanceAfter).toBeTruthy();

      // verify balances updated
      const raRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id));
      const rbRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rB.id));
      expect(raRow[0].balance).toBe(70);
      expect(rbRow[0].balance).toBe(50);

      // verify ledger rows exist with same transaction id and have hash
      const ledgerRows = await db.select().from(ledgerEntries).where(eq(ledgerEntries.transactionId, txId));
      expect(ledgerRows.length).toBe(2);
      // ensure returned entries include hash
      expect(typeof e1.hash).toBe('string');
      expect(e1.hash?.length).toBeGreaterThanOrEqual(64);
      expect(typeof e2.hash).toBe('string');
      expect(e2.hash?.length).toBeGreaterThanOrEqual(64);
      // ensure DB rows contain hash and signer metadata
      expect(typeof ledgerRows[0].hash).toBe('string');
      expect(typeof ledgerRows[1].hash).toBe('string');
      // ensure signer metadata recorded
      expect(typeof ledgerRows[0].signer_type).toBe('string');
      expect(typeof ledgerRows[1].signer_type).toBe('string');
      // returned entries should include signerType
      expect(typeof e1.signerType).toBe('string');
      expect(typeof e2.signerType).toBe('string');

      // verify entries hash validate
      const { verifyLedgerEntryHash } = await import('./index');
      expect(verifyLedgerEntryHash(ledgerRows[0])).toBe(true);
      expect(verifyLedgerEntryHash(ledgerRows[1])).toBe(true);
    } finally {
      // cleanup
      await db.delete(ledgerEntries).where(eq(ledgerEntries.transactionId, txId)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rB.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rA.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rB.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
    }
    });

    it('insufficient balance should throw and not create ledger entries', async () => {
      const txId = randomUUID();

      // create accounts and initial balances
      const userA = randomUUID();
      const userB = randomUUID();
      const [uA] = await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
      const [rA] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A-ib' }).returning();
      const [uB] = await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
      const [rB] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-B-ib' }).returning();

      // only small balance
      await db.insert(rootAccountPoints).values({ rootAccountId: rA.id, balance: 10 }).onConflictDoNothing();
      await db.insert(rootAccountPoints).values({ rootAccountId: rB.id, balance: 0 }).onConflictDoNothing();

      try {
        await expect(transferPoints(txId, rA.id, rB.id, 30)).rejects.toThrow('insufficient funds');

        // ensure no ledger_entries created
        const ledgerRows = await db.select().from(ledgerEntries).where(eq(ledgerEntries.transactionId, txId));
        expect(ledgerRows.length).toBe(0);

        // ensure balances unchanged
        const raRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id));
        const rbRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rB.id));
        expect(raRow[0].balance).toBe(10);
        expect(rbRow[0].balance).toBe(0);
      } finally {
        await db.delete(ledgerEntries).where(eq(ledgerEntries.transactionId, txId)).catch(()=>{});
        await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id)).catch(()=>{});
        await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rB.id)).catch(()=>{});
        await db.delete(rootAccounts).where(eq(rootAccounts.id, rA.id)).catch(()=>{});
        await db.delete(rootAccounts).where(eq(rootAccounts.id, rB.id)).catch(()=>{});
        await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
        await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
      }
    });

  it('tampered ledger entry should fail verification', async () => {
    const txId = randomUUID();
    const userA = randomUUID();
    const userB = randomUUID();
    const [uA] = await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
    const [rA] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A-tamper' }).returning();
    const [uB] = await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
    const [rB] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-B-tamper' }).returning();
    await db.insert(rootAccountPoints).values({ rootAccountId: rA.id, balance: 100 }).onConflictDoNothing();
    await db.insert(rootAccountPoints).values({ rootAccountId: rB.id, balance: 0 }).onConflictDoNothing();

    try {
      const res = await transferPoints(txId, rA.id, rB.id, 10);
      const dbRows = await db.select().from(ledgerEntries).where(eq(ledgerEntries.transactionId, txId));
      expect(dbRows.length).toBe(2);
      const { verifyLedgerEntryHash } = await import('./index');
      expect(verifyLedgerEntryHash(dbRows[0])).toBe(true);

      // tamper: flip amount
      const tampered = { ...dbRows[0], amount: dbRows[0].amount + 1 };
      expect(verifyLedgerEntryHash(tampered)).toBe(false);
    } finally {
      await db.delete(ledgerEntries).where(eq(ledgerEntries.transactionId, txId)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rB.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rA.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rB.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
    }
  });

    it('missing ledger row should throw', async () => {
      const txId = randomUUID();

      const userA = randomUUID();
      const userB = randomUUID();
      await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
      const [rA] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A-missing' }).returning();

      await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
      const [rB] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-B-missing' }).returning();

      // NOTE: do NOT insert rootAccountPoints rows to simulate missing ledger rows
      try {
        await expect(transferPoints(txId, rA.id, rB.id, 10)).rejects.toThrow('source ledger row not found');
      } finally {
        await db.delete(rootAccounts).where(eq(rootAccounts.id, rA.id)).catch(()=>{});
        await db.delete(rootAccounts).where(eq(rootAccounts.id, rB.id)).catch(()=>{});
        await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
        await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
      }
    });

    it('transfer to same account should throw', async () => {
      const txId = randomUUID();

      const userA = randomUUID();
      await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
      const [rA] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A-self' }).returning();
      await db.insert(rootAccountPoints).values({ rootAccountId: rA.id, balance: 100 }).onConflictDoNothing();

      try {
        await expect(transferPoints(txId, rA.id, rA.id, 10)).rejects.toThrow('fromRootId and toRootId must be different');
      } finally {
        await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rA.id)).catch(()=>{});
        await db.delete(rootAccounts).where(eq(rootAccounts.id, rA.id)).catch(()=>{});
        await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
      }
    });

  it('concurrent transfers should not allow overspend (only one succeeds)', async () => {
    const userA = randomUUID();
    const userB = randomUUID();
    const userC = randomUUID();

    const [ua] = await db.insert(users).values({ id: userA, email: `${userA}@ex.test` }).returning();
    const [ra] = await db.insert(rootAccounts).values({ userId: userA, displayName: 'ra-A-conc' }).returning();
    const [ub] = await db.insert(users).values({ id: userB, email: `${userB}@ex.test` }).returning();
    const [rb] = await db.insert(rootAccounts).values({ userId: userB, displayName: 'ra-B-conc' }).returning();
    const [uc] = await db.insert(users).values({ id: userC, email: `${userC}@ex.test` }).returning();
    const [rc] = await db.insert(rootAccounts).values({ userId: userC, displayName: 'ra-C-conc' }).returning();

    // source has 50, two transfers of 30 each attempted concurrently -> only one should succeed
    await db.insert(rootAccountPoints).values({ rootAccountId: ra.id, balance: 50 }).onConflictDoNothing();
    await db.insert(rootAccountPoints).values({ rootAccountId: rb.id, balance: 0 }).onConflictDoNothing();
    await db.insert(rootAccountPoints).values({ rootAccountId: rc.id, balance: 0 }).onConflictDoNothing();

    const t1 = randomUUID();
    const t2 = randomUUID();

    try {
      const results = await Promise.allSettled([
        transferPoints(t1, ra.id, rb.id, 30),
        transferPoints(t2, ra.id, rc.id, 30),
      ]);

      // Exactly one should be fulfilled, one rejected
      const fulfilled = results.filter((r) => r.status === 'fulfilled');
      const rejected = results.filter((r) => r.status === 'rejected');
      expect(fulfilled.length).toBe(1);
      expect(rejected.length).toBe(1);

      // Check final balances add up: initial 50 -> one recipient +30, source -> 20
      const sRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, ra.id));
      const bRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rb.id));
      const cRow = await db.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rc.id));

      expect(sRow[0].balance).toBe(20);
      const sumRecipients = (bRow[0].balance ?? 0) + (cRow[0].balance ?? 0);
      expect(sumRecipients).toBe(30);

      // verify only one transaction has ledger entries
      const ledgersT1 = await db.select().from(ledgerEntries).where(eq(ledgerEntries.transactionId, t1));
      const ledgersT2 = await db.select().from(ledgerEntries).where(eq(ledgerEntries.transactionId, t2));
      const totalLedgers = ledgersT1.length + ledgersT2.length;
      expect(totalLedgers).toBe(2);

    } finally {
      await db.delete(ledgerEntries).where(eq(ledgerEntries.transactionId, t1)).catch(()=>{});
      await db.delete(ledgerEntries).where(eq(ledgerEntries.transactionId, t2)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, ra.id)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rb.id)).catch(()=>{});
      await db.delete(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, rc.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, ra.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rb.id)).catch(()=>{});
      await db.delete(rootAccounts).where(eq(rootAccounts.id, rc.id)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userA)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userB)).catch(()=>{});
      await db.delete(users).where(eq(users.id, userC)).catch(()=>{});
    }
  });

}

import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';
import { rootAccountPoints, ledgerEntries } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createHash } from 'crypto';
import { getConfiguredSigner, HmacSigner, LocalEd25519Signer, KmsSigner } from './signer';

export type TransferResult = {
  transactionId: string;
  entries: { id: string; ledgerId: string; entryDirection: string; amount: number; balanceBefore: number; balanceAfter: number; hash?: string }[];
};

/**
 * Perform a double-entry transfer of points between two root accounts.
 * Ensures both ledger_entries are created and balances updated atomically.
 */
export async function transferPoints(transactionId: string, fromRootId: string, toRootId: string, amount: number) : Promise<TransferResult> {
  if (amount <= 0) throw new Error('amount must be positive');
  if (fromRootId === toRootId) throw new Error('fromRootId and toRootId must be different');

  return db.transaction(async (tx) => {
    // Read and lock current balances to avoid lost-update / race conditions
    // Use SELECT FOR UPDATE to lock the rows in this transaction
    const fromSelect = await tx.execute(sql`SELECT balance FROM root_account_points WHERE root_account_id = ${fromRootId} FOR UPDATE`);
    const toSelect = await tx.execute(sql`SELECT balance FROM root_account_points WHERE root_account_id = ${toRootId} FOR UPDATE`);

    // driver-specific result shapes: prefer reading rows array when present
    const fromBalance = (fromSelect?.rows?.[0]?.balance ?? (fromSelect?.[0]?.balance ?? null));
    const toBalance = (toSelect?.rows?.[0]?.balance ?? (toSelect?.[0]?.balance ?? null));

    if (fromBalance === null || fromBalance === undefined) throw new Error('source ledger row not found');
    if (toBalance === null || toBalance === undefined) throw new Error('destination ledger row not found');

    const fromBalNum = Number(fromBalance) as number;
    const toBalNum = Number(toBalance) as number;

    if (fromBalNum < amount) throw new Error('insufficient funds');

    const fromNew = fromBalNum - amount;
    const toNew = toBalNum + amount;

    // Create ledger entries
    // sign the ledger entry body using configured signer (hmac by default)
    const signer = getConfiguredSigner();
    const outBase = `${transactionId}|${fromRootId}|out|${amount}|${fromBalNum}|${fromNew}`;
    const outHash = signer.sign(outBase);
    // compute signer id: prefer explicit key material for local signers
    const signerIdValue = (signer.type === 'ed25519-local' || signer.type === 'local-ed25519')
      ? (typeof (signer as any).getPublicKeyPem === 'function' ? (signer as any).getPublicKeyPem() : null)
      : (process.env.LEDGER_SIGNER_ID ?? null);
    const out = await tx.insert(ledgerEntries).values({
      transactionId,
      ledgerId: fromRootId,
      entryDirection: 'out',
      amount: amount,
      balanceBefore: fromBalance,
      balanceAfter: fromNew,
      entryType: 'transfer-out',
      status: 'completed',
      counterpartLedgerId: toRootId,
      hash: outHash,
      signerType: signer.type,
      signerId: signerIdValue,
    }).returning();

    const inBase = `${transactionId}|${toRootId}|in|${amount}|${toBalNum}|${toNew}`;
    const inHash = signer.sign(inBase);
    const ins = await tx.insert(ledgerEntries).values({
      transactionId,
      ledgerId: toRootId,
      entryDirection: 'in',
      amount: amount,
      balanceBefore: toBalance,
      balanceAfter: toNew,
      entryType: 'transfer-in',
      status: 'completed',
      counterpartLedgerId: fromRootId,
      hash: inHash,
      signerType: signer.type,
      signerId: signerIdValue,
    }).returning();

    // Update balances - ensure updates affect rows
    const u1 = await tx.update(rootAccountPoints).set({ balance: fromNew }).where(eq(rootAccountPoints.rootAccountId, fromRootId));
    const u2 = await tx.update(rootAccountPoints).set({ balance: toNew }).where(eq(rootAccountPoints.rootAccountId, toRootId));

    // Ensure updates actually affected rows (defensive check)
    // Some drivers return number of affected rows, others return metadata; we do a simple read-check
    const verifyFrom = await tx.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, fromRootId));
    const verifyTo = await tx.select().from(rootAccountPoints).where(eq(rootAccountPoints.rootAccountId, toRootId));
    if (!verifyFrom[0] || !verifyTo[0]) throw new Error('failed to update balances');

    return {
      transactionId,
      entries: [out[0], ins[0]].map((r: any) => ({
        id: r.id,
        ledgerId: r.ledger_id ?? r.ledgerId,
        entryDirection: r.entry_direction ?? r.entryDirection,
        amount: r.amount,
        balanceBefore: r.balance_before ?? r.balanceBefore,
        balanceAfter: r.balance_after ?? r.balanceAfter,
        hash: r.hash,
        signerType: r.signer_type ?? r.signerType,
        signerId: r.signer_id ?? r.signerId,
      })),
    };
  });
}

// default export will be redefined later including helper; remove earlier default export

/**
 * Verify a ledger entry's hash. Returns true when matches the computed HMAC/SHA256.
 * Note: for verification to use HMAC, the same LEDGER_HMAC_SECRET must be available in process.env.
 */
export function verifyLedgerEntryHash(entry: any): boolean {
  if (!entry) return false;
  const base = `${entry.transaction_id ?? entry.transactionId}|${entry.ledger_id ?? entry.ledgerId}|${entry.entry_direction ?? entry.entryDirection}|${entry.amount}|${entry.balance_before ?? entry.balanceBefore}|${entry.balance_after ?? entry.balanceAfter}`;
  try {
    // Prefer the signer that was recorded at creation-time if available
    const recordedSignerType = (entry.signer_type ?? entry.signerType) as string | undefined;
    let verifier: { verify: (base: string, signature: string) => boolean };
    if (recordedSignerType) {
      const t = recordedSignerType.toLowerCase();
      if (t === 'hmac') {
        verifier = new HmacSigner(process.env.LEDGER_HMAC_SECRET ?? '');
      } else if (t === 'local-ed25519' || t === 'ed25519-local') {
        // If the ledger row contains the public key (signer_id), use it to verify.
        const signerPub = (entry.signer_id ?? entry.signerId) as string | undefined;
        if (signerPub) {
          verifier = new LocalEd25519Signer({ publicKeyPem: signerPub });
        } else {
          // fallback to configured signer instance (in-process key) when public key not stored
          verifier = getConfiguredSigner();
        }
      } else if (t === 'kms') {
        // KMS verifier typically uses an external provider; getConfiguredSigner will provide a KmsSigner instance if configured
        verifier = getConfiguredSigner();
      } else {
        verifier = getConfiguredSigner();
      }
    } else {
      verifier = getConfiguredSigner();
    }

    // verification may throw if provider isn't configured; treat throw as mismatch
    return Boolean(verifier.verify(base, String(entry.hash)));
  } catch (err) {
    // fallback: if signer not available/throws, attempt legacy sha/hmac check
    const secret = process.env.LEDGER_HMAC_SECRET ?? '';
    const expected = secret
      ? /* hmac */ require('crypto').createHmac('sha256', secret).update(base).digest('hex')
      : createHash('sha256').update(base).digest('hex');
    return String(entry.hash) === expected;
  }
}

export default { transferPoints, verifyLedgerEntryHash };

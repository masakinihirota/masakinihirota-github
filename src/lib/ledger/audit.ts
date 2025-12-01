import { verifyLedgerEntryHash } from './index';

export type AuditResult = {
  entryId: string | null;
  transactionId?: string | null;
  ledgerId?: string | null;
  ok: boolean;
  reason?: string;
};

/**
 * Verify a collection of ledger rows and return results for any mismatches
 */
export function auditLedgerRows(rows: Array<any>): AuditResult[] {
  const results: AuditResult[] = [];

  for (const r of rows) {
    try {
      const ok = verifyLedgerEntryHash(r);
      results.push({ entryId: r.id ?? null, transactionId: r.transaction_id ?? r.transactionId ?? null, ledgerId: r.ledger_id ?? r.ledgerId ?? null, ok, reason: ok ? undefined : 'signature_mismatch' });
    } catch (err: any) {
      results.push({ entryId: r.id ?? null, transactionId: r.transaction_id ?? r.transactionId ?? null, ledgerId: r.ledger_id ?? r.ledgerId ?? null, ok: false, reason: String(err?.message ?? 'error') });
    }
  }

  return results;
}

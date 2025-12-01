import { describe, it, expect } from 'vitest';
import { auditLedgerRows } from './audit';
import { getConfiguredSigner, resetConfiguredSigner } from './signer';

describe('auditLedgerRows', () => {
  it('detects tampered entry with HMAC', () => {
    process.env.LEDGER_SIGNER_TYPE = 'hmac';
    process.env.LEDGER_HMAC_SECRET = 'audit-secret';
    resetConfiguredSigner();
    const signer = getConfiguredSigner();
    const base = 'txA|ledgerA|in|5|10|15';
    const sig = signer.sign(base);

    const okRow = { id: '1', transactionId: 'txA', ledgerId: 'ledgerA', entryDirection: 'in', amount: 5, balanceBefore: 10, balanceAfter: 15, hash: sig, signerType: 'hmac' };
    const tampered = { ...okRow, amount: 6 };

    const results = auditLedgerRows([okRow, tampered]);
    expect(results.length).toBe(2);
    expect(results[0].ok).toBe(true);
    expect(results[1].ok).toBe(false);
    expect(results[1].reason).toBe('signature_mismatch');
  });

  it('verifies local-ed25519 rows and KMS mock rows', () => {
    // local-ed25519
    process.env.LEDGER_SIGNER_TYPE = 'local-ed25519';
    resetConfiguredSigner();
    const local = getConfiguredSigner();
    const base = 'txB|ledgerB|out|2|20|18';
    const sig = local.sign(base);
    const row = { id: '2', transactionId: 'txB', ledgerId: 'ledgerB', entryDirection: 'out', amount: 2, balanceBefore: 20, balanceAfter: 18, hash: sig, signerType: 'local-ed25519', signerId: (local as any).getPublicKeyPem() };

    // kms mock
    (global as any).__LEDGER_KMS_MOCK = { sign: (b: string) => `kms:${Buffer.from(b).toString('base64')}`, verify: (b: string, s: string) => s === `kms:${Buffer.from(b).toString('base64')}` };
    process.env.LEDGER_SIGNER_TYPE = 'kms';
    resetConfiguredSigner();
    const kms = getConfiguredSigner();
    const base2 = 'txC|ledgerC|in|1|0|1';
    const sig2 = kms.sign(base2);
    const row2 = { id: '3', transactionId: 'txC', ledgerId: 'ledgerC', entryDirection: 'in', amount: 1, balanceBefore: 0, balanceAfter: 1, hash: sig2, signerType: 'kms' };

    const results = auditLedgerRows([row, row2]);
    expect(results.find(r => r.entryId === '2')?.ok).toBe(true);
    expect(results.find(r => r.entryId === '3')?.ok).toBe(true);

    delete (global as any).__LEDGER_KMS_MOCK;
  });
});

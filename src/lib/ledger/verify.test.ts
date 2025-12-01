import { describe, it, expect } from 'vitest';
import { HmacSigner, LocalEd25519Signer, getConfiguredSigner, resetConfiguredSigner } from './signer';
import { verifyLedgerEntryHash } from './index';

describe('verifyLedgerEntryHash integration', () => {
  const baseParts = ['tx-1', 'ledger-1', 'in', '10', '100', '110'];
  const base = baseParts.join('|');

  it('HMAC default behaviour: signed entry verifies', async () => {
    process.env.LEDGER_SIGNER_TYPE = 'hmac';
    process.env.LEDGER_HMAC_SECRET = 'verify-test-secret';

    resetConfiguredSigner();
    const signer = getConfiguredSigner();
    const sig = signer.sign(base);
    const entry = { transactionId: 'tx-1', ledgerId: 'ledger-1', entryDirection: 'in', amount: 10, balanceBefore: 100, balanceAfter: 110, hash: sig };
    expect(verifyLedgerEntryHash(entry)).toBe(true);
  });

  it('Local-ed25519 signing path verifies', async () => {
    process.env.LEDGER_SIGNER_TYPE = 'local-ed25519';
    delete process.env.LEDGER_HMAC_SECRET;

    resetConfiguredSigner();
    const signer = getConfiguredSigner();
    const sig = signer.sign(base);
    const entry = { transactionId: 'tx-1', ledgerId: 'ledger-1', entryDirection: 'in', amount: 10, balanceBefore: 100, balanceAfter: 110, hash: sig };
    expect(verifyLedgerEntryHash(entry)).toBe(true);
  });
});

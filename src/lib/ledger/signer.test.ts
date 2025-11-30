import { LocalEd25519Signer } from './signer';

describe('LocalEd25519Signer', () => {
  it('generates keypair when none supplied and can sign/verify', () => {
    const s = new LocalEd25519Signer();
    const pub = s.getPublicKeyPem();
    expect(pub).toBeTruthy();

    const payload = 'test-message-' + Math.random();
    const sig = s.sign(payload);
    expect(typeof sig).toBe('string');

    // verify using pub-only signer
    const sv = new LocalEd25519Signer({ publicKeyPem: String(pub) });
    expect(sv.verify(payload, sig)).toBe(true);
  });

  it('throws when signing without a private key', () => {
    const s = new LocalEd25519Signer({ publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIj...\n-----END PUBLIC KEY-----' });
    expect(() => s.sign('msg')).toThrow();
  });
});
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getConfiguredSigner, HmacSigner, LocalEd25519Signer, resetConfiguredSigner } from './signer';

beforeEach(() => resetConfiguredSigner());

describe('ledger signer abstraction', () => {
  const base = 'tx|ledger|in|10|100|110';

  it('HmacSigner (env default) signs and verifies correctly', async () => {
    process.env.LEDGER_HMAC_SECRET = 'unit-test-secret';
    process.env.LEDGER_SIGNER_TYPE = 'hmac';

    const signer = getConfiguredSigner();
    const sig = signer.sign(base);
    expect(typeof sig).toBe('string');
    expect(sig.length).toBeGreaterThanOrEqual(64);
    const ok = await signer.verify(base, sig);
    expect(ok).toBeTruthy();
  });

  it('LocalEd25519Signer can sign and verify (PEM keys in-memory)', async () => {
    // create signer with generated keypair (constructor does that when env not set)
    delete process.env.LEDGER_SIGNER_TYPE;
    const signer = new LocalEd25519Signer();
    const sig = signer.sign(base);
    expect(typeof sig).toBe('string');
    const ok = await signer.verify(base, sig);
    expect(ok).toBeTruthy();
  });

  it('getConfiguredSigner falls back to HMAC when unknown type', async () => {
    process.env.LEDGER_SIGNER_TYPE = 'some-unknown-type';
    process.env.LEDGER_HMAC_SECRET = 'fallback-secret';
    const signer = getConfiguredSigner();
    const sig = signer.sign(base);
    expect(signer.verify(base, sig)).toBeTruthy();
  });

  it('KMS signer uses mock provider when configured', () => {
    // set a mock provider on the global so KmsSigner can use it
    (global as any).__LEDGER_KMS_MOCK = {
      sign: (base: string) => `kms:${Buffer.from(base).toString('base64')}`,
      verify: (base: string, sig: string) => sig === `kms:${Buffer.from(base).toString('base64')}`,
    };
    process.env.LEDGER_SIGNER_TYPE = 'kms';
    resetConfiguredSigner();
    const signer = getConfiguredSigner();
    const sig = signer.sign(base);
    expect(typeof sig).toBe('string');
    expect(signer.verify(base, sig)).toBe(true);
    // cleanup mock
    delete (global as any).__LEDGER_KMS_MOCK;
  });
});

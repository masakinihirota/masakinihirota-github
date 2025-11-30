import { createHmac, generateKeyPairSync } from 'crypto';

export type Signer = {
  type: string;
  sign(base: string): string;
  verify(base: string, signature: string): boolean;
};

/**
 * HMAC-SHA256 signer (backward compatible with existing behavior)
 */
export class HmacSigner implements Signer {
  public readonly type = 'hmac';
  constructor(private secret: string) {}

  sign(base: string) {
    return createHmac('sha256', this.secret).update(base).digest('hex');
  }

  verify(base: string, signature: string) {
    const expected = createHmac('sha256', this.secret).update(base).digest('hex');
    return expected === String(signature);
  }
}

/**
 * Local asymmetric signer using Ed25519 keys. Intended for local development and tests.
 * - use LEDGER_LOCAL_PRIVATE_KEY and LEDGER_LOCAL_PUBLIC_KEY (PEM) to configure
 * - if not provided, a new keypair is generated in-memory
 */
export class LocalEd25519Signer implements Signer {
  public readonly type = 'ed25519-local';
  private privateKey: string | Buffer;
  private publicKey: string | Buffer;

  constructor(options?: { privateKeyPem?: string; publicKeyPem?: string }) {
    if (options?.privateKeyPem && options?.publicKeyPem) {
      this.privateKey = options.privateKeyPem;
      this.publicKey = options.publicKeyPem;
    } else if (process.env.LEDGER_LOCAL_PRIVATE_KEY && process.env.LEDGER_LOCAL_PUBLIC_KEY) {
      this.privateKey = process.env.LEDGER_LOCAL_PRIVATE_KEY;
      this.publicKey = process.env.LEDGER_LOCAL_PUBLIC_KEY;
    } else if (options?.publicKeyPem) {
      // public-key-only constructor path for verification-only usage
      this.publicKey = options.publicKeyPem;
    } else {
      // generate ephemeral pair for testing/dev convenience
      const { publicKey, privateKey } = generateKeyPairSync('ed25519');
      this.privateKey = privateKey.export({ type: 'pkcs8', format: 'pem' });
      this.publicKey = publicKey.export({ type: 'spki', format: 'pem' });
    }
  }

  sign(base: string) {
    if (!this.privateKey) throw new Error('private key not available for signing');
    // Ed25519 signing - sign raw message
    const sig = require('crypto').sign(null, Buffer.from(String(base)), this.privateKey);
    return sig.toString('base64');
  }
  verify(base: string, signature: string) {
    try {
      const sigBuf = Buffer.from(String(signature), 'base64');
      return require('crypto').verify(null, Buffer.from(String(base)), this.publicKey, sigBuf);
    } catch (err) {
      return false;
    }
  }

  getPublicKeyPem(): string | Buffer {
    return this.publicKey;
  }
}

/**
 * Placeholder for a KMS-backed signer implementation.
 * This module exposes a stub to make higher-level code pluggable.
 * Implement real KMS client integration per cloud provider in the future.
 */
export class KmsSigner implements Signer {
  public readonly type = 'kms';
  constructor(private readonly cfg?: any) {}

  /**
   * This KMS signer supports a 'mock' provider for tests via global.__LEDGER_KMS_MOCK
   * The mock provider must implement sign(base) and verify(base, signature) synchronously.
   * For real KMS integration you'll wire a provider client and call it here.
   */
  sign(base: string) {
    // test hook: allow simple in-memory mock provider for unit tests
    const mock = (global as any).__LEDGER_KMS_MOCK;
    if (mock && typeof mock.sign === 'function') {
      return String(mock.sign(base));
    }
    throw new Error('KMS signing not configured - no provider available');
  }

  verify(base: string, signature: string) {
    const mock = (global as any).__LEDGER_KMS_MOCK;
    if (mock && typeof mock.verify === 'function') {
      return Boolean(mock.verify(base, signature));
    }
    throw new Error('KMS verification not configured');
  }
}

/**
 * Helper that picks a configured signer implementation.
 * Controls defaults and development fallbacks.
 */
export function getConfiguredSigner(): Signer {
  // memoize so multiple calls within same process use the same key material
  if ((global as any).__LEDGER_SIGNER_INSTANCE__) return (global as any).__LEDGER_SIGNER_INSTANCE__ as Signer;
  const type = (process.env.LEDGER_SIGNER_TYPE || 'hmac').toLowerCase();

  if (type === 'hmac') {
    const secret = process.env.LEDGER_HMAC_SECRET ?? '';
    const s = new HmacSigner(secret);
    (global as any).__LEDGER_SIGNER_INSTANCE__ = s;
    return s;
  }

  if (type === 'local-ed25519' || type === 'ed25519-local') {
    const s = new LocalEd25519Signer();
    (global as any).__LEDGER_SIGNER_INSTANCE__ = s;
    return s;
  }

  if (type === 'kms') {
    const s = new KmsSigner();
    (global as any).__LEDGER_SIGNER_INSTANCE__ = s;
    return s;
  }

  // fallback to HMAC when unknown
  const fallback = new HmacSigner(process.env.LEDGER_HMAC_SECRET ?? '');
  (global as any).__LEDGER_SIGNER_INSTANCE__ = fallback;
  return fallback;
}

/**
 * Reset any configured signer instance (test helper)
 */
export function resetConfiguredSigner() {
  delete (global as any).__LEDGER_SIGNER_INSTANCE__;
}

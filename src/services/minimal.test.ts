import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

const SHOULD_RUN_DB_TESTS = (process.env.RUN_DB_TESTS === '1') || Boolean(process.env.DATABASE_URL);

if (!SHOULD_RUN_DB_TESTS) {
  describe.skip('Minimal DB Test (skipped - no DB)', () => {});
} else {

describe('Minimal DB Test', () => {
  it('should insert a user', async () => {
    const id = randomUUID();
    try {
      await db.insert(users).values({ id, email: `min-${id}@example.com` });
      expect(true).toBe(true);
    } catch (e) {
      console.error('Minimal test failed:', e);
      throw e;
    } finally {
      // cleanup
      try {
        await db.delete(users).where(eq(users.id, id));
      } catch (e) {}
    }
  });
});

}

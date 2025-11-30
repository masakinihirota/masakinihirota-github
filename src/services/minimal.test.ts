import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { users } from '@/db/schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

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

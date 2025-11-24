import { describe, it, expect } from 'vitest';
import { db } from '@/lib/db';
import { valueDefinitions, valueCategories } from './schema';
import { ValueCategory } from './constants';
import { eq } from 'drizzle-orm';

describe('Value Definitions Schema Integrity', () => {
  const testContent = 'Test Value Definition TDD';

  it('should fail to insert if default category "Uncategorized" does not exist in master table', async () => {
    // 1. Ensure "Uncategorized" is NOT in valueCategories
    // First, delete any existing definitions that use this category to avoid FK violation on delete
    await db.delete(valueDefinitions).where(eq(valueDefinitions.categoryId, ValueCategory.Uncategorized));
    await db.delete(valueCategories).where(eq(valueCategories.id, ValueCategory.Uncategorized));

    // 2. Try to insert into valueDefinitions without categoryId (relying on default)
    // This should fail because the default value 'Uncategorized' violates FK since we deleted it.
    await expect(
      db.insert(valueDefinitions).values({
        content: testContent
      }).returning()
    ).rejects.toThrow(); // Expecting FK violation error
  });

  it('should successfully insert when "Uncategorized" category exists', async () => {
    // 1. Insert "Uncategorized" into valueCategories
    await db.insert(valueCategories).values({
      id: ValueCategory.Uncategorized,
      name: 'Uncategorized',
    }).onConflictDoNothing();

    // 2. Insert into valueDefinitions without categoryId
    const result = await db.insert(valueDefinitions).values({
      content: testContent,
    }).returning();

    // 3. Verify insertion and default value
    expect(result).toHaveLength(1);
    expect(result[0].categoryId).toBe(ValueCategory.Uncategorized);

    // Cleanup
    await db.delete(valueDefinitions).where(eq(valueDefinitions.id, result[0].id));
  });
});

'use server';

import { z } from 'zod';

const createRootAccountSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  location: z.string().optional(),
});

export type CreateRootAccountInput = z.infer<typeof createRootAccountSchema>;

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { rootAccounts } from '@/db/schema';

export async function createRootAccountAction(input: CreateRootAccountInput) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error('Unauthorized');
  }

  const validatedData = createRootAccountSchema.parse(input);

  const [newRootAccount] = await db.insert(rootAccounts).values({
    userId: user.id,
    displayName: validatedData.displayName,
    location: validatedData.location,
  }).returning();

  return newRootAccount;
}

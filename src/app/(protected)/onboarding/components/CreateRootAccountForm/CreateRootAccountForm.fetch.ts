'use server';

import { z } from 'zod';

const createRootAccountSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50),
  location: z.string().optional(),
});

export type CreateRootAccountInput = z.infer<typeof createRootAccountSchema>;

export async function createRootAccountAction(input: CreateRootAccountInput) {
  throw new Error('Not implemented');
}

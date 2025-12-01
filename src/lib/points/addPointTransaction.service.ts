/**
 * Add point transaction service
 * Handles creating point transactions with balance validation
 */
import { db } from '@/lib/db';
import { pointTransactions, rootAccountPoints } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface AddPointTransactionInput {
  rootAccountId: string;
  delta: number;
  reason?: string;
  relatedEntity?: string;
  relatedId?: string;
}

export interface AddPointTransactionResult {
  success: boolean;
  data?: {
    transactionId: string;
    newBalance: number;
  };
  error?: string;
}

/**
 * Adds a point transaction for a root account
 * Validates that balance won't go negative for deductions
 * @param input - The transaction input
 * @returns AddPointTransactionResult with success flag and new balance
 */
export async function addPointTransaction(
  input: AddPointTransactionInput
): Promise<AddPointTransactionResult> {
  try {
    // Get current balance
    const [currentBalance] = await db
      .select({ balance: rootAccountPoints.balance })
      .from(rootAccountPoints)
      .where(eq(rootAccountPoints.rootAccountId, input.rootAccountId));

    const balance = currentBalance?.balance ?? 0;

    // Validate: balance cannot go negative
    if (input.delta < 0 && balance + input.delta < 0) {
      return {
        success: false,
        error: '残高不足です',
      };
    }

    // Insert transaction
    const [inserted] = await db
      .insert(pointTransactions)
      .values({
        rootAccountId: input.rootAccountId,
        delta: input.delta,
        reason: input.reason ?? null,
        relatedEntity: input.relatedEntity ?? null,
        relatedId: input.relatedId ?? null,
      })
      .returning({ id: pointTransactions.id });

    const newBalance = balance + input.delta;

    return {
      success: true,
      data: {
        transactionId: inserted.id,
        newBalance,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

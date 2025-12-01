/**
 * Point history service
 * Handles database operations for retrieving point transaction history
 */
import { db } from '@/lib/db';
import { pointTransactions } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface PointTransaction {
  id: string;
  rootAccountId: string;
  delta: number;
  reason: string | null;
  relatedEntity: string | null;
  relatedId: string | null;
  createdAt: Date;
}

export interface GetPointHistoryResult {
  success: boolean;
  data?: PointTransaction[];
  error?: string;
}

/**
 * Retrieves point transaction history for a root account
 * @param rootAccountId - The root account ID to get history for
 * @returns GetPointHistoryResult with success flag and transaction data
 */
export async function getPointHistory(
  rootAccountId: string
): Promise<GetPointHistoryResult> {
  try {
    const rows = await db
      .select({
        id: pointTransactions.id,
        rootAccountId: pointTransactions.rootAccountId,
        delta: pointTransactions.delta,
        reason: pointTransactions.reason,
        relatedEntity: pointTransactions.relatedEntity,
        relatedId: pointTransactions.relatedId,
        createdAt: pointTransactions.createdAt,
      })
      .from(pointTransactions)
      .where(eq(pointTransactions.rootAccountId, rootAccountId))
      .orderBy(desc(pointTransactions.createdAt));

    return {
      success: true,
      data: rows as PointTransaction[],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

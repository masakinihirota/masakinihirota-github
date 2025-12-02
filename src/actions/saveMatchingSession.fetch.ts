/**
 * @file saveMatchingSession.fetch.ts
 * @description マッチングセッションと候補スコアを保存する Server Action
 */

'use server'

import { db } from '@/lib/db'
import { matchingSessions, matchingScores } from '@/db/schema'
import type { EnhancedMatchResult } from '@/lib/match/computeValueMatches.logic'

export interface SaveMatchingSessionResult {
  sessionId: string | null
  savedCount: number
}

/**
 * マッチングセッションとスコアを保存する
 * @param profileId - 対象プロフィールID
 * @param matches - マッチング結果の配列
 * @returns セッションIDと保存件数
 */
export async function saveMatchingSession(
  profileId: string,
  matches: EnhancedMatchResult[]
): Promise<SaveMatchingSessionResult> {
  // 空のマッチング結果の場合は何も保存しない
  if (matches.length === 0) {
    return { sessionId: null, savedCount: 0 }
  }

  // 1. matching_sessions にセッションを作成
  const [session] = await db
    .insert(matchingSessions)
    .values({
      profileId,
      status: 'completed',
      resultSnapshot: JSON.stringify(matches),
    })
    .returning({ id: matchingSessions.id })

  // 2. matching_scores に各候補のスコアを保存
  const scoreRecords = matches.map((match, index) => ({
    sessionId: session.id,
    candidateProfileId: match.profileId,
    workScore: String(match.workScore),
    valueScore: String(match.valueScore),
    totalScore: String(match.totalScore),
    rank: index + 1, // 1-based rank
    commonWorks: JSON.stringify(match.commonWorks),
    commonValues: JSON.stringify(match.commonValues),
  }))

  await db.insert(matchingScores).values(scoreRecords)

  return {
    sessionId: session.id,
    savedCount: matches.length,
  }
}

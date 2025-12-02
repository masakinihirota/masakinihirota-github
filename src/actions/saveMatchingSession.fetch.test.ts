/**
 * @file saveMatchingSession.fetch.test.ts
 * @description TDD RED - マッチングセッション保存 Server Action のテスト
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { EnhancedMatchResult } from '@/lib/match/computeValueMatches.logic'
import { setupDbMock } from '@/tests/setup/mockDb'

// --- Setup DB mocks before importing the module under test ---
const { insert: insertMock } = setupDbMock()

vi.mock('@/db/schema', () => ({
  matchingSessions: { id: 'id', profileId: 'profileId' },
  matchingScores: { id: 'id', sessionId: 'sessionId', candidateProfileId: 'candidateProfileId' },
}))

describe('saveMatchingSession (Server Action)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // デフォルトのモック動作を設定
    insertMock.mockImplementation(() => ({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([{ id: 'session-1' }]),
      }),
    }))
  })

  it('saves session and scores to database', async () => {
    // Arrange
    const mockMatches: EnhancedMatchResult[] = [
      {
        profileId: 'profile-2',
        workScore: 150,
        valueScore: 100,
        totalScore: 250,
        commonWorks: ['work-1'],
        commonValues: ['value-1', 'value-2'],
      },
      {
        profileId: 'profile-3',
        workScore: 80,
        valueScore: 50,
        totalScore: 130,
        commonWorks: [],
        commonValues: ['value-1'],
      },
    ]

    // Act
    const { saveMatchingSession } = await import('@/actions/saveMatchingSession.fetch')
    const result = await saveMatchingSession('profile-1', mockMatches)

    // Assert
    expect(result).toHaveProperty('sessionId')
    expect(result.sessionId).toBe('session-1')
    expect(insertMock).toHaveBeenCalled()
  })

  it('creates matching_scores for each candidate with rank', async () => {
    // Arrange
    const mockMatches: EnhancedMatchResult[] = [
      {
        profileId: 'profile-2',
        workScore: 200,
        valueScore: 100,
        totalScore: 300,
        commonWorks: [],
        commonValues: [],
      },
    ]

    // Act
    const { saveMatchingSession } = await import('@/actions/saveMatchingSession.fetch')
    await saveMatchingSession('profile-1', mockMatches)

    // Assert - Should have called insert twice (session + scores)
    expect(insertMock).toHaveBeenCalledTimes(2)
  })

  it('returns empty sessionId when no matches provided', async () => {
    // Act
    const { saveMatchingSession } = await import('@/actions/saveMatchingSession.fetch')
    const result = await saveMatchingSession('profile-1', [])

    // Assert
    expect(result.sessionId).toBeNull()
    expect(result.savedCount).toBe(0)
    // insert は呼ばれない
    expect(insertMock).not.toHaveBeenCalled()
  })

  it('includes savedCount in result', async () => {
    // Arrange
    const mockMatches: EnhancedMatchResult[] = [
      {
        profileId: 'profile-2',
        workScore: 100,
        valueScore: 50,
        totalScore: 150,
        commonWorks: [],
        commonValues: [],
      },
      {
        profileId: 'profile-3',
        workScore: 80,
        valueScore: 30,
        totalScore: 110,
        commonWorks: [],
        commonValues: [],
      },
    ]

    // Act
    const { saveMatchingSession } = await import('@/actions/saveMatchingSession.fetch')
    const result = await saveMatchingSession('profile-1', mockMatches)

    // Assert
    expect(result.savedCount).toBe(2)
  })
})

/**
 * @file matchingSession.schema.test.ts
 * @description TDD RED - matching_sessions / matching_scores テーブルのスキーマ定義テスト
 */

import { describe, it, expect } from 'vitest'

describe('matching_sessions schema', () => {
  it('should have matchingSessions table defined in schema', async () => {
    // スキーマから matchingSessions がエクスポートされていることを確認
    const { matchingSessions } = await import('@/db/schema')
    expect(matchingSessions).toBeDefined()
  })

  it('should have required columns in matchingSessions', async () => {
    const { matchingSessions } = await import('@/db/schema')
    // テーブル定義からカラム名を取得
    const columnNames = Object.keys(matchingSessions)
    expect(columnNames).toContain('id')
    expect(columnNames).toContain('profileId')
    expect(columnNames).toContain('status')
    expect(columnNames).toContain('createdAt')
    expect(columnNames).toContain('updatedAt')
  })
})

describe('matching_scores schema', () => {
  it('should have matchingScores table defined in schema', async () => {
    const { matchingScores } = await import('@/db/schema')
    expect(matchingScores).toBeDefined()
  })

  it('should have required columns in matchingScores', async () => {
    const { matchingScores } = await import('@/db/schema')
    const columnNames = Object.keys(matchingScores)
    expect(columnNames).toContain('sessionId')
    expect(columnNames).toContain('candidateProfileId')
    expect(columnNames).toContain('workScore')
    expect(columnNames).toContain('valueScore')
    expect(columnNames).toContain('totalScore')
    expect(columnNames).toContain('rank')
    expect(columnNames).toContain('createdAt')
  })
})

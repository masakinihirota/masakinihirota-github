import { scoreProfileWork, type ProfileWork } from '@/lib/aggregations/workAggregations.logic'

export type ProfileValue = {
  profileId: string
  valueId: string
}

export type EnhancedMatchInput = {
  targetProfileId: string
  otherProfileId: string
  targetWorks: ProfileWork[]
  otherWorks: ProfileWork[]
  targetValues: ProfileValue[]
  otherValues: ProfileValue[]
}

export type EnhancedMatchResult = {
  profileId: string
  workScore: number
  valueScore: number
  totalScore: number
  commonWorks: { workId: string; score: number }[]
  commonValues: { valueId: string }[]
}

export type MatchScoringOptions = {
  valueWeight?: number
}

const DEFAULT_VALUE_WEIGHT = 50

/**
 * Compute a score based on shared values between two profiles.
 * Each common value contributes `valueWeight` points to the total score.
 */
export function computeValueMatchScore(
  targetValues: ProfileValue[],
  otherValues: ProfileValue[],
  valueWeight: number = DEFAULT_VALUE_WEIGHT
): number {
  if (targetValues.length === 0) return 0

  const targetValueIds = new Set(targetValues.map(v => v.valueId))
  const otherValueIds = new Set(otherValues.map(v => v.valueId))

  let commonCount = 0
  for (const vid of targetValueIds) {
    if (otherValueIds.has(vid)) {
      commonCount++
    }
  }

  return commonCount * valueWeight
}

/**
 * Compute an enhanced match score that combines work-based and value-based scoring.
 * This provides a more comprehensive matching algorithm that considers both
 * shared media preferences (works) and shared beliefs/principles (values).
 */
export function computeEnhancedMatchScore(
  input: EnhancedMatchInput,
  options: MatchScoringOptions = {}
): EnhancedMatchResult {
  const { valueWeight = DEFAULT_VALUE_WEIGHT } = options

  // Build work lookup for target profile
  const targetWorksMap = new Map<string, ProfileWork>()
  for (const pw of input.targetWorks) {
    targetWorksMap.set(pw.workId, pw)
  }

  // Build value lookup for target profile
  const targetValueIds = new Set(input.targetValues.map(v => v.valueId))

  // Calculate work-based score
  let workScore = 0
  const commonWorks: { workId: string; score: number }[] = []

  for (const pw of input.otherWorks) {
    const targetWork = targetWorksMap.get(pw.workId)
    if (targetWork) {
      const targetScore = scoreProfileWork(targetWork)
      const otherScore = scoreProfileWork(pw)
      const pairScore = targetScore + otherScore

      workScore += pairScore
      commonWorks.push({ workId: pw.workId, score: pairScore })
    }
  }

  // Calculate value-based score
  const commonValues: { valueId: string }[] = []
  for (const v of input.otherValues) {
    if (targetValueIds.has(v.valueId)) {
      commonValues.push({ valueId: v.valueId })
    }
  }
  const valueScore = commonValues.length * valueWeight

  return {
    profileId: input.otherProfileId,
    workScore,
    valueScore,
    totalScore: workScore + valueScore,
    commonWorks,
    commonValues,
  }
}

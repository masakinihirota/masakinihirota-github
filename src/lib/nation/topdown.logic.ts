/**
 * トップダウン国（内政）のビジネスロジック
 * 設計書: 0130-02-トップダウン国（内政）設計書.md
 */

import { NationLevel, NATION_LEVEL_CONFIG } from '@/db/constants'

// =====================================================
// 型定義
// =====================================================

export interface TopdownNation {
  id: string
  name: string
  description?: string
  founderProfileId: string
  founderOrganizationId?: string
  scaleLevel: number
  status: 'active' | 'suspended' | 'archived'
  totalPopulation: number
  residentOrgCount: number
  visitorOrgCount: number
  // 簡易ルール
  rulePenaltyHolder: 'forbidden' | 'allowed'
  ruleYellowCardLimit: number
  ruleRedCardLimit: number
  ruleTrustDaysRequired: number
  ruleMinMembers: number
  ruleGoalMatch: boolean
  // 税率
  marketTaxRate: number
  residencyFee: number
}

export interface CreateTopdownNationInput {
  name: string
  description?: string
  founderProfileId: string
  founderOrganizationId: string
  initialBlockX: number
  initialBlockY: number
  // 簡易ルール
  rulePenaltyHolder?: 'forbidden' | 'allowed'
  ruleYellowCardLimit?: number
  ruleRedCardLimit?: number
  ruleTrustDaysRequired?: number
  ruleMinMembers?: number
  ruleGoalMatch?: boolean
  // 税率
  marketTaxRate?: number
  residencyFee?: number
}

export interface NationEligibilityCheck {
  isEligible: boolean
  reason?: string
}

export interface BankTransferInput {
  fromAccountId: string
  toAccountId: string
  amount: number
  description?: string
}

export interface BankTransferResult {
  success: boolean
  transactionId?: string
  error?: string
}

export interface LoanApplicationInput {
  accountId: string
  amount: number
  reason: string
  dueDate?: Date
}

export interface LoanResult {
  success: boolean
  loanId?: string
  error?: string
}

// =====================================================
// 国関連ロジック
// =====================================================

/**
 * 人口に基づく規模レベルを計算
 */
export function calculateScaleLevel(population: number): NationLevel {
  const levels = Object.entries(NATION_LEVEL_CONFIG)
    .sort((a, b) => b[1].level - a[1].level) // 高いレベルから順にチェック

  for (const [levelName, config] of levels) {
    if (population <= config.maxPopulation) {
      continue
    }
    // population > maxPopulation の場合、次のレベル
  }

  // 人口に応じた適切なレベルを返す
  for (const [levelName, config] of Object.entries(NATION_LEVEL_CONFIG).sort((a, b) => a[1].level - b[1].level)) {
    if (population <= config.maxPopulation) {
      return levelName as NationLevel
    }
  }

  return NationLevel.Nation // 最大レベル
}

/**
 * 規模レベルから最大ブロック数を取得
 */
export function getMaxBlocksForLevel(scaleLevel: number): number {
  const levelEntry = Object.entries(NATION_LEVEL_CONFIG).find(([_, config]) => config.level === scaleLevel)
  return levelEntry ? levelEntry[1].maxBlocks : 1
}

/**
 * 組織の入国資格チェック
 */
export function checkOrganizationEligibility(
  organizationData: {
    memberCount: number
    yellowCardCount: number
    redCardCount: number
    trustDays: number
    hasPenalty: boolean
    goal?: string
  },
  nationRules: {
    rulePenaltyHolder: 'forbidden' | 'allowed'
    ruleYellowCardLimit: number
    ruleRedCardLimit: number
    ruleTrustDaysRequired: number
    ruleMinMembers: number
    ruleGoalMatch: boolean
    nationGoal?: string
  }
): NationEligibilityCheck {
  // ペナルティチェック
  if (nationRules.rulePenaltyHolder === 'forbidden' && organizationData.hasPenalty) {
    return { isEligible: false, reason: 'ペナルティ保持者は入国できません' }
  }

  // イエローカード上限チェック
  if (nationRules.ruleYellowCardLimit >= 0 && organizationData.yellowCardCount > nationRules.ruleYellowCardLimit) {
    return { isEligible: false, reason: `イエローカードが上限(${nationRules.ruleYellowCardLimit}枚)を超えています` }
  }

  // レッドカード上限チェック
  if (nationRules.ruleRedCardLimit >= 0 && organizationData.redCardCount > nationRules.ruleRedCardLimit) {
    return { isEligible: false, reason: `レッドカードが上限(${nationRules.ruleRedCardLimit}枚)を超えています` }
  }

  // 信頼継続日数チェック
  if (organizationData.trustDays < nationRules.ruleTrustDaysRequired) {
    return { isEligible: false, reason: `信頼継続日数が不足しています(必要: ${nationRules.ruleTrustDaysRequired}日)` }
  }

  // メンバー数チェック
  if (organizationData.memberCount < nationRules.ruleMinMembers) {
    return { isEligible: false, reason: `メンバー数が不足しています(必要: ${nationRules.ruleMinMembers}人)` }
  }

  // 目的一致チェック
  if (nationRules.ruleGoalMatch && organizationData.goal !== nationRules.nationGoal) {
    return { isEligible: false, reason: '国の目的と一致していません' }
  }

  return { isEligible: true }
}

// =====================================================
// 銀行関連ロジック
// =====================================================

/**
 * 残高チェック
 */
export function checkSufficientBalance(balance: number, amount: number): boolean {
  return balance >= amount
}

/**
 * ローン限度額を計算（組織の規模やスコアに基づく）
 * 仮実装: 現在の残高の2倍まで
 */
export function calculateLoanLimit(
  accountBalance: number,
  organizationMemberCount: number,
  trustScore: number = 100
): number {
  const baseLimit = accountBalance * 2
  const memberBonus = organizationMemberCount * 100
  const trustBonus = trustScore * 10
  return Math.floor(baseLimit + memberBonus + trustBonus)
}

/**
 * 取引手数料を計算
 */
export function calculateTransactionFee(amount: number, feeRate: number = 0): number {
  return Math.floor(amount * feeRate / 100)
}

/**
 * マーケット税金を計算
 */
export function calculateMarketTax(rewardAmount: number, taxRate: number): number {
  return Math.floor(rewardAmount * taxRate / 100)
}

// =====================================================
// マップ関連ロジック
// =====================================================

/**
 * 隣接座標かどうかチェック（上下左右）
 */
export function isAdjacentBlock(
  existingBlocks: Array<{ x: number; y: number }>,
  targetX: number,
  targetY: number
): boolean {
  if (existingBlocks.length === 0) {
    return true // 最初のブロックは任意の位置に配置可能
  }

  const adjacentOffsets = [
    { dx: 0, dy: -1 }, // 上
    { dx: 0, dy: 1 },  // 下
    { dx: -1, dy: 0 }, // 左
    { dx: 1, dy: 0 },  // 右
  ]

  for (const block of existingBlocks) {
    for (const offset of adjacentOffsets) {
      if (block.x + offset.dx === targetX && block.y + offset.dy === targetY) {
        return true
      }
    }
  }

  return false
}

/**
 * 拡張可能なブロック数を計算
 */
export function calculateRemainingBlocks(
  currentBlockCount: number,
  scaleLevel: number
): number {
  const maxBlocks = getMaxBlocksForLevel(scaleLevel)
  return Math.max(0, maxBlocks - currentBlockCount)
}

/**
 * ブロック座標が有効範囲内かチェック
 */
export function isValidBlockCoordinate(
  x: number,
  y: number,
  worldWidth: number = 100,
  worldHeight: number = 100
): boolean {
  return x >= 0 && x < worldWidth && y >= 0 && y < worldHeight
}

// =====================================================
// 調停者関連ロジック
// =====================================================

/**
 * 調停者ローテーション周期（日数）
 */
export const MEDIATOR_ROTATION_DAYS = 18

/**
 * 次の調停者交代日を計算
 */
export function calculateNextRotationDate(currentStartDate: Date): Date {
  const nextDate = new Date(currentStartDate)
  nextDate.setDate(nextDate.getDate() + MEDIATOR_ROTATION_DAYS)
  return nextDate
}

/**
 * 調停者の必要人数を計算（組織メンバーの8-10%）
 */
export function calculateRequiredMediators(totalMembers: number): number {
  const percentage = 0.08 // 8%
  return Math.max(1, Math.ceil(totalMembers * percentage))
}

// =====================================================
// ペナルティ再入国制限
// =====================================================

export const RE_ENTRY_RESTRICTION_DAYS = {
  yellowCard: 30,
  redCard: 90,
  leave: 180,
  anotherDimension: Infinity, // 永久
} as const

/**
 * ペナルティ後の再入国可能日を計算
 */
export function calculateReEntryDate(
  penaltyDate: Date,
  penaltyType: keyof typeof RE_ENTRY_RESTRICTION_DAYS
): Date | null {
  const restrictionDays = RE_ENTRY_RESTRICTION_DAYS[penaltyType]
  if (restrictionDays === Infinity) {
    return null // 永久禁止
  }
  const reEntryDate = new Date(penaltyDate)
  reEntryDate.setDate(reEntryDate.getDate() + restrictionDays)
  return reEntryDate
}

/**
 * 再入国可能かチェック
 */
export function canReEnter(
  penaltyDate: Date,
  penaltyType: keyof typeof RE_ENTRY_RESTRICTION_DAYS,
  currentDate: Date = new Date()
): boolean {
  const reEntryDate = calculateReEntryDate(penaltyDate, penaltyType)
  if (reEntryDate === null) {
    return false
  }
  return currentDate >= reEntryDate
}

// =====================================================
// Task 9.1: ポイント徴収ロジック (FR-130-003, FR-130-030)
// =====================================================

/**
 * 猶予期間（日数）
 */
export const GRACE_PERIOD_DAYS = 30

/**
 * 規模レベル別の基本維持費
 */
const MAINTENANCE_FEE_BASE: Record<number, number> = {
  1: 100,   // Group
  2: 200,   // Club
  3: 400,   // Village
  4: 800,   // Town
  5: 1600,  // City
  6: 3200,  // Region
  7: 6400,  // State
  8: 12800, // Nation
}

/**
 * 月次維持費を計算 (FR-130-003)
 * @param scaleLevel 国の規模レベル (1-8)
 * @param residentOrgCount 常駐組織数
 * @returns 月次維持費（ポイント）
 */
export function calculateMonthlyMaintenanceFee(
  scaleLevel: number,
  residentOrgCount: number
): number {
  const baseFee = MAINTENANCE_FEE_BASE[scaleLevel] ?? 100
  // 常駐組織数に応じた追加費用（組織ごとに基本費用の10%）
  const orgFee = Math.floor(baseFee * 0.1 * Math.max(0, residentOrgCount - 1))
  return baseFee + orgFee
}

/**
 * 常駐料金を計算 (FR-130-007)
 * @param baseRate 基本常駐料金（国が設定）
 * @param months 月数
 * @returns 常駐料金（ポイント）
 */
export function calculateResidencyFee(baseRate: number, months: number): number {
  return baseRate * months
}

/**
 * 徴収結果の型
 */
export interface FeeCollectionResult {
  /** 実際に徴収できた金額 */
  collected: number
  /** 不足額 */
  shortfall: number
  /** 徴収成功かどうか */
  success: boolean
}

/**
 * 徴収結果を計算
 * @param balance 口座残高
 * @param feeAmount 徴収額
 * @returns 徴収結果
 */
export function calculateFeeCollectionResult(
  balance: number,
  feeAmount: number
): FeeCollectionResult {
  if (balance >= feeAmount) {
    return {
      collected: feeAmount,
      shortfall: 0,
      success: true,
    }
  }
  return {
    collected: balance,
    shortfall: feeAmount - balance,
    success: false,
  }
}

/**
 * 国ステータス判定結果の型
 */
export interface NationStatusAfterCollection {
  /** 新しいステータス */
  status: 'active' | 'suspended' | 'archived'
  /** 猶予期間終了日（猶予期間中の場合） */
  gracePeriodEndDate: Date | null
}

/**
 * 徴収後の国ステータスを判定 (FR-130-003, FR-130-004)
 * @param collectionSuccess 徴収成功かどうか
 * @param daysSinceFirstFailure 初回失敗からの日数
 * @param currentStatus 現在のステータス
 * @returns 判定結果
 */
export function determineNationStatusAfterCollection(
  collectionSuccess: boolean,
  daysSinceFirstFailure: number,
  currentStatus: 'active' | 'suspended' | 'archived'
): NationStatusAfterCollection {
  // 既に suspended または archived の場合は維持
  if (currentStatus === 'suspended' || currentStatus === 'archived') {
    return { status: currentStatus, gracePeriodEndDate: null }
  }

  // 徴収成功の場合は active を維持
  if (collectionSuccess) {
    return { status: 'active', gracePeriodEndDate: null }
  }

  // 猶予期間超過の場合は suspended に移行
  if (daysSinceFirstFailure > GRACE_PERIOD_DAYS) {
    return { status: 'suspended', gracePeriodEndDate: null }
  }

  // 猶予期間中は active を維持し、猶予期間終了日を設定
  const gracePeriodEndDate = new Date()
  gracePeriodEndDate.setDate(gracePeriodEndDate.getDate() + (GRACE_PERIOD_DAYS - daysSinceFirstFailure))

  return {
    status: 'active',
    gracePeriodEndDate,
  }
}

// =====================================================
// Task 9.3: 追加調停者ローテーションロジック (FR-130-011)
// =====================================================

/**
 * ローテーションが必要かどうかを判定
 * @param lastRotationDate 前回のローテーション日
 * @param currentDate 現在日
 * @returns ローテーションが必要か
 */
export function shouldRotateMediator(
  lastRotationDate: Date,
  currentDate: Date = new Date()
): boolean {
  const diffMs = currentDate.getTime() - lastRotationDate.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return diffDays >= MEDIATOR_ROTATION_DAYS
}

/**
 * 調停者の型
 */
export interface Mediator {
  id: string
  rotationOrder: number
  isActive: boolean
}

/**
 * 次の調停者を決定
 * @param mediators 調停者一覧（rotationOrder昇順）
 * @param currentMediatorId 現在の調停者ID
 * @returns 次の調停者（見つからない場合は最初の調停者）
 */
export function getNextMediator(
  mediators: Mediator[],
  currentMediatorId: string
): Mediator | null {
  if (mediators.length === 0) {
    return null
  }

  if (mediators.length === 1) {
    return mediators[0] // 一人しかいない場合はその人を返す
  }

  const currentIndex = mediators.findIndex((m) => m.id === currentMediatorId)
  if (currentIndex === -1) {
    return mediators[0] // 見つからない場合は最初の調停者
  }

  const nextIndex = (currentIndex + 1) % mediators.length
  return mediators[nextIndex]
}

'use server'

/**
 * トップダウン国（内政）Server Actions
 * 設計書: 0130-02-トップダウン国（内政）設計書.md
 */

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import {
  topdownNations,
  topdownNationMemberships,
  nationBankAccounts,
  nationBankTransactions,
  nationMarketPosts,
  nationMarketApplications,
  nationAuditLogs,
  mapBlocks,
  profiles,
  rootAccounts,
  organizations,
  organizationMembers,
} from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import {
  calculateScaleLevel,
  checkOrganizationEligibility,
  isAdjacentBlock,
  isValidBlockCoordinate,
  calculateRemainingBlocks,
  calculateMarketTax,
  getMaxBlocksForLevel,
  type CreateTopdownNationInput,
} from './topdown.logic'
import { BankAccountOwnerType, BankTransactionType, NationMembershipType } from '@/db/constants'

// =====================================================
// 型定義
// =====================================================

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface CreateNationResult {
  nationId: string
  bankAccountId: string
}

export interface JoinNationResult {
  membershipType: string
  joinedAt: Date
}

// =====================================================
// 国管理 Actions
// =====================================================

/**
 * 建国 (FR-130-001, FR-130-002)
 */
export async function createTopdownNation(
  input: CreateTopdownNationInput
): Promise<ActionResult<CreateNationResult>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  // バリデーション
  if (!input.name || input.name.trim() === '') {
    return { success: false, error: '国名は必須です' }
  }

  if (!input.founderOrganizationId) {
    return { success: false, error: '建国組織の指定が必要です' }
  }

  // 座標の有効性チェック
  if (!isValidBlockCoordinate(input.initialBlockX, input.initialBlockY)) {
    return { success: false, error: '無効なブロック座標です' }
  }

  try {
    let nationId = ''
    let bankAccountId = ''

    await db.transaction(async (tx) => {
      // 座標が空いているかチェック
      const existingBlock = await tx
        .select()
        .from(mapBlocks)
        .where(and(eq(mapBlocks.x, input.initialBlockX), eq(mapBlocks.y, input.initialBlockY)))
        .limit(1)

      if (existingBlock.length > 0) {
        throw new Error('指定された座標は既に使用されています')
      }

      // 国を作成
      const [newNation] = await tx
        .insert(topdownNations)
        .values({
          name: input.name.trim(),
          description: input.description,
          founderProfileId: input.founderProfileId,
          founderOrganizationId: input.founderOrganizationId,
          scaleLevel: 1,
          status: 'active',
          rulePenaltyHolder: input.rulePenaltyHolder ?? 'forbidden',
          ruleYellowCardLimit: input.ruleYellowCardLimit ?? 0,
          ruleRedCardLimit: input.ruleRedCardLimit ?? 0,
          ruleTrustDaysRequired: input.ruleTrustDaysRequired ?? 0,
          ruleMinMembers: input.ruleMinMembers ?? 1,
          ruleGoalMatch: input.ruleGoalMatch ?? false,
          marketTaxRate: input.marketTaxRate ?? 5,
          residencyFee: input.residencyFee ?? 0,
          totalPopulation: 0,
          residentOrgCount: 1, // 建国組織
          visitorOrgCount: 0,
        })
        .returning()

      nationId = newNation.id

      // 建国組織を常駐として登録
      await tx.insert(topdownNationMemberships).values({
        nationId: nationId,
        organizationId: input.founderOrganizationId,
        membershipType: NationMembershipType.Resident,
        approvedBy: input.founderProfileId,
      })

      // 国庫銀行口座を作成
      const [nationBankAccount] = await tx
        .insert(nationBankAccounts)
        .values({
          nationId: nationId,
          ownerType: BankAccountOwnerType.Nation,
          ownerId: nationId,
          balance: 0,
        })
        .returning()

      bankAccountId = nationBankAccount.id

      // 建国組織の銀行口座を作成
      await tx.insert(nationBankAccounts).values({
        nationId: nationId,
        ownerType: BankAccountOwnerType.Organization,
        ownerId: input.founderOrganizationId,
        balance: 0,
      })

      // マップブロックを登録
      await tx.insert(mapBlocks).values({
        x: input.initialBlockX,
        y: input.initialBlockY,
        nationId: nationId,
        status: 'occupied',
      })

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId: nationId,
        actorProfileId: input.founderProfileId,
        action: 'create',
        targetType: 'nation',
        targetId: nationId,
        newValue: { name: input.name, founderOrganizationId: input.founderOrganizationId },
      })
    })

    return {
      success: true,
      data: { nationId, bankAccountId },
    }
  } catch (error) {
    console.error('建国エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '建国に失敗しました',
    }
  }
}

/**
 * 国設定更新
 */
export async function updateNationSettings(
  nationId: string,
  settings: Partial<{
    description: string
    rulePenaltyHolder: 'forbidden' | 'allowed'
    ruleYellowCardLimit: number
    ruleRedCardLimit: number
    ruleTrustDaysRequired: number
    ruleMinMembers: number
    ruleGoalMatch: boolean
    marketTaxRate: number
    residencyFee: number
  }>
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    // 国の建国者かチェック
    const nation = await db.query.topdownNations.findFirst({
      where: eq(topdownNations.id, nationId),
    })

    if (!nation) {
      return { success: false, error: '国が見つかりません' }
    }

    // 権限チェック（建国者のみ）
    const rootAccount = await db.query.rootAccounts.findFirst({
      where: eq(rootAccounts.userId, user.id),
    })

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.rootAccountId, rootAccount!.id),
    })

    if (nation.founderProfileId !== profile?.id) {
      return { success: false, error: '国設定を変更する権限がありません' }
    }

    await db.transaction(async (tx) => {
      const previousValue = { ...nation }

      await tx
        .update(topdownNations)
        .set({
          ...settings,
          updatedAt: new Date(),
        })
        .where(eq(topdownNations.id, nationId))

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId: nationId,
        actorProfileId: profile.id,
        action: 'update',
        targetType: 'nation_settings',
        targetId: nationId,
        previousValue: previousValue,
        newValue: settings,
      })
    })

    return { success: true }
  } catch (error) {
    console.error('国設定更新エラー:', error)
    return { success: false, error: '国設定の更新に失敗しました' }
  }
}

// =====================================================
// 参加管理 Actions
// =====================================================

/**
 * 入国申請 (FR-130-006)
 */
export async function joinNation(
  nationId: string,
  organizationId: string,
  membershipType: 'resident' | 'visitor' = 'visitor'
): Promise<ActionResult<JoinNationResult>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    // 国の取得
    const nation = await db.query.topdownNations.findFirst({
      where: eq(topdownNations.id, nationId),
    })

    if (!nation) {
      return { success: false, error: '国が見つかりません' }
    }

    if (nation.status !== 'active') {
      return { success: false, error: 'この国は現在参加を受け付けていません' }
    }

    // 組織情報取得
    const organization = await db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    })

    if (!organization) {
      return { success: false, error: '組織が見つかりません' }
    }

    // 組織メンバー数取得
    const memberCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(organizationMembers)
      .where(eq(organizationMembers.organizationId, organizationId))

    const memberCount = memberCountResult[0]?.count ?? 0

    // TODO: ペナルティ情報取得（実際の実装では penalties テーブルから取得）
    const organizationData = {
      memberCount,
      yellowCardCount: 0,
      redCardCount: 0,
      trustDays: 365, // 仮の値
      hasPenalty: false,
      goal: organization.description,
    }

    // 入国資格チェック
    const eligibility = checkOrganizationEligibility(organizationData, {
      rulePenaltyHolder: nation.rulePenaltyHolder as 'forbidden' | 'allowed',
      ruleYellowCardLimit: nation.ruleYellowCardLimit ?? 0,
      ruleRedCardLimit: nation.ruleRedCardLimit ?? 0,
      ruleTrustDaysRequired: nation.ruleTrustDaysRequired ?? 0,
      ruleMinMembers: nation.ruleMinMembers ?? 1,
      ruleGoalMatch: nation.ruleGoalMatch ?? false,
      nationGoal: nation.description ?? undefined,
    })

    if (!eligibility.isEligible) {
      return { success: false, error: eligibility.reason }
    }

    // 既に参加していないかチェック
    const existingMembership = await db.query.topdownNationMemberships.findFirst({
      where: and(
        eq(topdownNationMemberships.nationId, nationId),
        eq(topdownNationMemberships.organizationId, organizationId)
      ),
    })

    if (existingMembership) {
      return { success: false, error: 'この組織は既にこの国に参加しています' }
    }

    const joinedAt = new Date()

    await db.transaction(async (tx) => {
      // メンバーシップを作成
      await tx.insert(topdownNationMemberships).values({
        nationId,
        organizationId,
        membershipType: membershipType === 'resident' ? NationMembershipType.Resident : NationMembershipType.Visitor,
        joinedAt,
      })

      // 常駐の場合、銀行口座を作成
      if (membershipType === 'resident') {
        await tx.insert(nationBankAccounts).values({
          nationId,
          ownerType: BankAccountOwnerType.Organization,
          ownerId: organizationId,
          balance: 0,
        })

        // 統計更新
        await tx
          .update(topdownNations)
          .set({
            residentOrgCount: sql`${topdownNations.residentOrgCount} + 1`,
            totalPopulation: sql`${topdownNations.totalPopulation} + ${memberCount}`,
            updatedAt: new Date(),
          })
          .where(eq(topdownNations.id, nationId))
      } else {
        await tx
          .update(topdownNations)
          .set({
            visitorOrgCount: sql`${topdownNations.visitorOrgCount} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(topdownNations.id, nationId))
      }
    })

    return {
      success: true,
      data: { membershipType, joinedAt },
    }
  } catch (error) {
    console.error('入国エラー:', error)
    return { success: false, error: '入国処理に失敗しました' }
  }
}

/**
 * 退国処理
 */
export async function leaveNation(
  nationId: string,
  organizationId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    const membership = await db.query.topdownNationMemberships.findFirst({
      where: and(
        eq(topdownNationMemberships.nationId, nationId),
        eq(topdownNationMemberships.organizationId, organizationId)
      ),
    })

    if (!membership) {
      return { success: false, error: 'メンバーシップが見つかりません' }
    }

    await db.transaction(async (tx) => {
      // メンバーシップ削除
      await tx
        .delete(topdownNationMemberships)
        .where(
          and(
            eq(topdownNationMemberships.nationId, nationId),
            eq(topdownNationMemberships.organizationId, organizationId)
          )
        )

      // 銀行口座は残す（残高がある場合のため）

      // 統計更新
      if (membership.membershipType === NationMembershipType.Resident) {
        await tx
          .update(topdownNations)
          .set({
            residentOrgCount: sql`GREATEST(0, ${topdownNations.residentOrgCount} - 1)`,
            updatedAt: new Date(),
          })
          .where(eq(topdownNations.id, nationId))
      } else {
        await tx
          .update(topdownNations)
          .set({
            visitorOrgCount: sql`GREATEST(0, ${topdownNations.visitorOrgCount} - 1)`,
            updatedAt: new Date(),
          })
          .where(eq(topdownNations.id, nationId))
      }
    })

    return { success: true }
  } catch (error) {
    console.error('退国エラー:', error)
    return { success: false, error: '退国処理に失敗しました' }
  }
}

// =====================================================
// 国一覧・検索 Actions
// =====================================================

/**
 * 国一覧取得
 */
export async function getNations(options?: {
  status?: 'active' | 'suspended' | 'archived'
  limit?: number
  offset?: number
}): Promise<ActionResult<typeof topdownNations.$inferSelect[]>> {
  try {
    const query = db.query.topdownNations.findMany({
      where: options?.status ? eq(topdownNations.status, options.status) : undefined,
      limit: options?.limit ?? 20,
      offset: options?.offset ?? 0,
      orderBy: (nations, { desc }) => [desc(nations.totalPopulation)],
    })

    const nations = await query

    return { success: true, data: nations }
  } catch (error) {
    console.error('国一覧取得エラー:', error)
    return { success: false, error: '国一覧の取得に失敗しました' }
  }
}

/**
 * 国詳細取得
 */
export async function getNationById(
  nationId: string
): Promise<ActionResult<typeof topdownNations.$inferSelect & {
  memberships: typeof topdownNationMemberships.$inferSelect[]
}>> {
  try {
    const nation = await db.query.topdownNations.findFirst({
      where: eq(topdownNations.id, nationId),
    })

    if (!nation) {
      return { success: false, error: '国が見つかりません' }
    }

    const memberships = await db.query.topdownNationMemberships.findMany({
      where: eq(topdownNationMemberships.nationId, nationId),
    })

    return {
      success: true,
      data: { ...nation, memberships },
    }
  } catch (error) {
    console.error('国詳細取得エラー:', error)
    return { success: false, error: '国詳細の取得に失敗しました' }
  }
}

// =====================================================
// Task 9.2: 常駐管理・国規模レベル判定 Actions
// =====================================================

/**
 * 国規模レベル更新結果の型
 */
export interface ScaleLevelUpdateResult {
  nationId: string
  previousLevel: number
  newLevel: number
  totalPopulation: number
  residentOrgCount: number
  visitorOrgCount: number
  levelChanged: boolean
}

/**
 * 国の規模レベルを更新 (FR-130-009)
 * 常駐組織のメンバー数を集計し、規模レベルを再計算する
 */
export async function updateNationScaleLevel(
  nationId: string
): Promise<ActionResult<ScaleLevelUpdateResult>> {
  try {
    let result: ScaleLevelUpdateResult | null = null

    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      // メンバーシップ一覧取得
      const memberships = await tx
        .select()
        .from(topdownNationMemberships)
        .where(eq(topdownNationMemberships.nationId, nationId))

      // 常駐組織数と訪問組織数をカウント
      const residentOrgs = memberships.filter((m) => m.membershipType === 'resident')
      const visitorOrgs = memberships.filter((m) => m.membershipType === 'visitor')

      // 各常駐組織のメンバー数を集計
      let totalPopulation = 0
      for (const membership of residentOrgs) {
        const orgMemberCount = await tx
          .select({ count: sql<number>`count(*)` })
          .from(organizationMembers)
          .where(eq(organizationMembers.organizationId, membership.organizationId))

        totalPopulation += orgMemberCount[0]?.count ?? 0
      }

      // 新しい規模レベルを計算
      const newLevel = calculateScaleLevel(totalPopulation)
      const newLevelNum = Object.entries(calculateScaleLevel).length > 0
        ? Object.values(
            Object.entries({ Group: 1, Community: 2, Village: 3, Town: 4, City: 5, Metropolis: 6, State: 7, Nation: 8 })
              .find(([k]) => k === newLevel) ?? ['', 1]
          )[1] as number
        : 1

      const previousLevel = nation.scaleLevel
      const levelChanged = previousLevel !== newLevelNum

      // 統計情報を更新
      await tx
        .update(topdownNations)
        .set({
          scaleLevel: newLevelNum,
          totalPopulation,
          residentOrgCount: residentOrgs.length,
          visitorOrgCount: visitorOrgs.length,
          updatedAt: new Date(),
        })
        .where(eq(topdownNations.id, nationId))

      // 監査ログを記録（レベル変更時のみ）
      if (levelChanged) {
        await tx.insert(nationAuditLogs).values({
          nationId,
          actorProfileId: nation.founderProfileId,
          action: 'update',
          targetType: 'nation',
          targetId: nationId,
          previousValue: { scaleLevel: previousLevel, totalPopulation: nation.totalPopulation },
          newValue: { scaleLevel: newLevelNum, totalPopulation },
        })
      }

      result = {
        nationId,
        previousLevel,
        newLevel: newLevelNum,
        totalPopulation,
        residentOrgCount: residentOrgs.length,
        visitorOrgCount: visitorOrgs.length,
        levelChanged,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('規模レベル更新エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '規模レベルの更新に失敗しました',
    }
  }
}

/**
 * 組織の入国処理 (FR-130-006)
 */
export async function joinNation(
  nationId: string,
  organizationId: string,
  membershipType: 'resident' | 'visitor' = 'visitor'
): Promise<ActionResult<JoinNationResult>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    let result: JoinNationResult | null = null

    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      if (nation.status !== 'active') {
        throw new Error('この国は現在入国できません')
      }

      // 既存メンバーシップチェック
      const existingMembership = await tx.query.topdownNationMemberships.findFirst({
        where: and(
          eq(topdownNationMemberships.nationId, nationId),
          eq(topdownNationMemberships.organizationId, organizationId)
        ),
      })

      if (existingMembership) {
        throw new Error('既にこの国に参加しています')
      }

      // 組織情報取得（資格チェック用）
      const org = await tx.query.organizations.findFirst({
        where: eq(organizations.id, organizationId),
      })

      if (!org) {
        throw new Error('組織が見つかりません')
      }

      // 組織のメンバー数を取得
      const memberCountResult = await tx
        .select({ count: sql<number>`count(*)` })
        .from(organizationMembers)
        .where(eq(organizationMembers.organizationId, organizationId))
      const memberCount = memberCountResult[0]?.count ?? 0

      // 資格チェック
      const eligibility = checkOrganizationEligibility(
        {
          memberCount,
          yellowCardCount: 0, // TODO: 実際のペナルティカウント
          redCardCount: 0,
          trustDays: 0, // TODO: 信頼日数計算
          hasPenalty: false,
          goal: org.goal ?? undefined,
        },
        {
          rulePenaltyHolder: nation.rulePenaltyHolder as 'forbidden' | 'allowed',
          ruleYellowCardLimit: nation.ruleYellowCardLimit ?? 0,
          ruleRedCardLimit: nation.ruleRedCardLimit ?? 0,
          ruleTrustDaysRequired: nation.ruleTrustDaysRequired ?? 0,
          ruleMinMembers: nation.ruleMinMembers ?? 1,
          ruleGoalMatch: nation.ruleGoalMatch ?? false,
          nationGoal: nation.description ?? undefined,
        }
      )

      if (!eligibility.isEligible) {
        throw new Error(eligibility.reason ?? '入国資格がありません')
      }

      // メンバーシップ作成
      const now = new Date()
      await tx.insert(topdownNationMemberships).values({
        nationId,
        organizationId,
        membershipType,
        joinedAt: now,
      })

      // 常駐の場合は銀行口座も作成
      if (membershipType === 'resident') {
        await tx.insert(nationBankAccounts).values({
          nationId,
          ownerType: 'organization',
          ownerId: organizationId,
          balance: 0,
        })
      }

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId,
        action: 'join',
        targetType: 'membership',
        targetId: organizationId,
        newValue: { organizationId, membershipType },
      })

      result = {
        membershipType,
        joinedAt: now,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('入国処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '入国処理に失敗しました',
    }
  }
}

/**
 * 組織の退国処理
 */
export async function leaveNation(
  nationId: string,
  organizationId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    await db.transaction(async (tx) => {
      // メンバーシップ確認
      const membership = await tx.query.topdownNationMemberships.findFirst({
        where: and(
          eq(topdownNationMemberships.nationId, nationId),
          eq(topdownNationMemberships.organizationId, organizationId)
        ),
      })

      if (!membership) {
        throw new Error('メンバーシップが見つかりません')
      }

      // メンバーシップ削除
      await tx
        .delete(topdownNationMemberships)
        .where(and(
          eq(topdownNationMemberships.nationId, nationId),
          eq(topdownNationMemberships.organizationId, organizationId)
        ))

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId,
        action: 'leave',
        targetType: 'membership',
        targetId: organizationId,
        previousValue: { membershipType: membership.membershipType },
      })
    })

    return { success: true }
  } catch (error) {
    console.error('退国処理エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '退国処理に失敗しました',
    }
  }
}

// =====================================================
// Task 9.3: 調停者委任 Actions (FR-130-011, FR-130-012)
// =====================================================

import { nationMediators } from '@/db/schema'
import { calculateNextRotationDate, MEDIATOR_ROTATION_DAYS } from './topdown.logic'
import { desc } from 'drizzle-orm'

/**
 * 調停者情報の型
 */
export interface MediatorInfo {
  id: string
  nationId: string
  organizationId: string
  profileId: string
  rotationOrder: number
  isActive: boolean
  startDate: Date | null
  endDate: Date | null
}

/**
 * 調停者を任命 (FR-130-011)
 */
export async function appointMediator(
  nationId: string,
  organizationId: string,
  profileId: string
): Promise<ActionResult<MediatorInfo>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    let result: MediatorInfo | null = null

    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      // 権限チェック（建国者のみ）
      const rootAccount = await tx.query.rootAccounts.findFirst({
        where: eq(rootAccounts.userId, user.id),
      })

      const profile = await tx.query.profiles.findFirst({
        where: eq(profiles.rootAccountId, rootAccount!.id),
      })

      if (nation.founderProfileId !== profile?.id) {
        throw new Error('調停者を任命する権限がありません')
      }

      // メンバーシップ確認（常駐組織のみ）
      const membership = await tx.query.topdownNationMemberships.findFirst({
        where: and(
          eq(topdownNationMemberships.nationId, nationId),
          eq(topdownNationMemberships.organizationId, organizationId),
          eq(topdownNationMemberships.membershipType, 'resident')
        ),
      })

      if (!membership) {
        throw new Error('常駐組織のメンバーのみ調停者になれます')
      }

      // 既存の調停者数を取得してローテーション順序を決定
      const existingMediators = await tx
        .select()
        .from(nationMediators)
        .where(eq(nationMediators.nationId, nationId))
        .orderBy(desc(nationMediators.rotationOrder))

      const nextOrder = existingMediators.length > 0
        ? existingMediators[0].rotationOrder + 1
        : 1

      // 調停者を登録
      const [newMediator] = await tx
        .insert(nationMediators)
        .values({
          nationId,
          organizationId,
          profileId,
          rotationOrder: nextOrder,
          isActive: existingMediators.length === 0, // 最初の調停者はアクティブ
          startDate: existingMediators.length === 0 ? new Date() : null,
        })
        .returning()

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId,
        actorProfileId: profile?.id,
        action: 'appoint',
        targetType: 'mediator',
        targetId: newMediator.id,
        newValue: { organizationId, profileId, rotationOrder: nextOrder },
      })

      result = {
        id: newMediator.id,
        nationId: newMediator.nationId,
        organizationId: newMediator.organizationId,
        profileId: newMediator.profileId,
        rotationOrder: newMediator.rotationOrder,
        isActive: newMediator.isActive,
        startDate: newMediator.startDate,
        endDate: newMediator.endDate,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('調停者任命エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '調停者の任命に失敗しました',
    }
  }
}

/**
 * 調停者ローテーション実行 (FR-130-011)
 * 18日ごとに次の調停者に交代する
 */
export async function rotateMediators(
  nationId: string
): Promise<ActionResult<{ previousMediatorId: string; newMediatorId: string }>> {
  try {
    let result: { previousMediatorId: string; newMediatorId: string } | null = null

    await db.transaction(async (tx) => {
      // 現在アクティブな調停者を取得
      const activeMediator = await tx.query.nationMediators.findFirst({
        where: and(
          eq(nationMediators.nationId, nationId),
          eq(nationMediators.isActive, true)
        ),
      })

      if (!activeMediator) {
        throw new Error('アクティブな調停者が見つかりません')
      }

      // 全調停者をローテーション順で取得
      const allMediators = await tx
        .select()
        .from(nationMediators)
        .where(eq(nationMediators.nationId, nationId))
        .orderBy(nationMediators.rotationOrder)

      if (allMediators.length < 2) {
        throw new Error('ローテーションには最低2人の調停者が必要です')
      }

      // 次の調停者を決定（ループ）
      const currentIndex = allMediators.findIndex((m) => m.id === activeMediator.id)
      const nextIndex = (currentIndex + 1) % allMediators.length
      const nextMediator = allMediators[nextIndex]

      const now = new Date()
      const nextEndDate = calculateNextRotationDate(now)

      // 現在の調停者を非アクティブに
      await tx
        .update(nationMediators)
        .set({
          isActive: false,
          endDate: now,
        })
        .where(eq(nationMediators.id, activeMediator.id))

      // 次の調停者をアクティブに
      await tx
        .update(nationMediators)
        .set({
          isActive: true,
          startDate: now,
          endDate: nextEndDate,
        })
        .where(eq(nationMediators.id, nextMediator.id))

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId,
        action: 'rotate',
        targetType: 'mediator',
        targetId: nextMediator.id,
        previousValue: { mediatorId: activeMediator.id },
        newValue: { mediatorId: nextMediator.id, startDate: now, endDate: nextEndDate },
      })

      result = {
        previousMediatorId: activeMediator.id,
        newMediatorId: nextMediator.id,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('調停者ローテーションエラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '調停者ローテーションに失敗しました',
    }
  }
}

/**
 * 調停者一覧取得
 */
export async function getMediators(
  nationId: string
): Promise<ActionResult<MediatorInfo[]>> {
  try {
    const mediators = await db
      .select()
      .from(nationMediators)
      .where(eq(nationMediators.nationId, nationId))
      .orderBy(nationMediators.rotationOrder)

    return {
      success: true,
      data: mediators.map((m) => ({
        id: m.id,
        nationId: m.nationId,
        organizationId: m.organizationId,
        profileId: m.profileId,
        rotationOrder: m.rotationOrder,
        isActive: m.isActive,
        startDate: m.startDate,
        endDate: m.endDate,
      })),
    }
  } catch (error) {
    console.error('調停者一覧取得エラー:', error)
    return { success: false, error: '調停者一覧の取得に失敗しました' }
  }
}

/**
 * 調停者解任
 */
export async function dismissMediator(
  nationId: string,
  mediatorId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      // 権限チェック
      const rootAccount = await tx.query.rootAccounts.findFirst({
        where: eq(rootAccounts.userId, user.id),
      })

      const profile = await tx.query.profiles.findFirst({
        where: eq(profiles.rootAccountId, rootAccount!.id),
      })

      if (nation.founderProfileId !== profile?.id) {
        throw new Error('調停者を解任する権限がありません')
      }

      // 調停者を取得
      const mediator = await tx.query.nationMediators.findFirst({
        where: and(
          eq(nationMediators.id, mediatorId),
          eq(nationMediators.nationId, nationId)
        ),
      })

      if (!mediator) {
        throw new Error('調停者が見つかりません')
      }

      // アクティブな調停者の場合は次の調停者に引き継ぎ
      if (mediator.isActive) {
        const allMediators = await tx
          .select()
          .from(nationMediators)
          .where(eq(nationMediators.nationId, nationId))
          .orderBy(nationMediators.rotationOrder)

        if (allMediators.length > 1) {
          const currentIndex = allMediators.findIndex((m) => m.id === mediatorId)
          const nextIndex = (currentIndex + 1) % allMediators.length
          const nextMediator = allMediators.filter((m) => m.id !== mediatorId)[0]

          if (nextMediator) {
            await tx
              .update(nationMediators)
              .set({
                isActive: true,
                startDate: new Date(),
              })
              .where(eq(nationMediators.id, nextMediator.id))
          }
        }
      }

      // 調停者を削除
      await tx
        .delete(nationMediators)
        .where(eq(nationMediators.id, mediatorId))

      // 監査ログ
      await tx.insert(nationAuditLogs).values({
        nationId,
        actorProfileId: profile?.id,
        action: 'dismiss',
        targetType: 'mediator',
        targetId: mediatorId,
        previousValue: { organizationId: mediator.organizationId, profileId: mediator.profileId },
      })
    })

    return { success: true }
  } catch (error) {
    console.error('調停者解任エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '調停者の解任に失敗しました',
    }
  }
}

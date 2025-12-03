'use server'

/**
 * 国マーケット Server Actions
 * 設計書: 0130-02-トップダウン国（内政）設計書.md
 */

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import {
  nationMarketPosts,
  nationMarketApplications,
  nationMarketRatings,
  nationBankAccounts,
  nationBankTransactions,
  topdownNations,
  topdownNationMemberships,
  profiles,
  rootAccounts,
  organizations,
} from '@/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import { calculateMarketTax } from './topdown.logic'
import { BankTransactionType, NationMembershipType, MarketPostStatus } from '@/db/constants'

// =====================================================
// 型定義
// =====================================================

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface MarketPostInput {
  nationId: string
  authorOrgId: string
  authorProfileId: string
  title: string
  content: string
  rewardAmount?: number
  category?: string
}

export interface MarketPostInfo {
  id: string
  nationId: string
  authorOrgId: string
  authorProfileId: string
  title: string
  content: string
  rewardAmount: number
  status: string
  category?: string
  createdAt: Date
  authorOrgName?: string
}

export interface MarketApplicationInfo {
  id: string
  postId: string
  applicantOrgId: string
  applicantProfileId: string
  message?: string
  status: string
  createdAt: Date
  applicantOrgName?: string
}

// =====================================================
// マーケット投稿 Actions
// =====================================================

/**
 * マーケット投稿作成 (FR-130-015)
 */
export async function createMarketPost(
  input: MarketPostInput
): Promise<ActionResult<{ postId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  // バリデーション
  if (!input.title || input.title.trim() === '') {
    return { success: false, error: 'タイトルは必須です' }
  }

  if (!input.content || input.content.trim() === '') {
    return { success: false, error: '内容は必須です' }
  }

  try {
    // 組織が常駐しているかチェック
    const membership = await db.query.topdownNationMemberships.findFirst({
      where: and(
        eq(topdownNationMemberships.nationId, input.nationId),
        eq(topdownNationMemberships.organizationId, input.authorOrgId),
        eq(topdownNationMemberships.membershipType, NationMembershipType.Resident)
      ),
    })

    if (!membership) {
      return { success: false, error: '常駐組織のみがマーケットに投稿できます' }
    }

    const [post] = await db
      .insert(nationMarketPosts)
      .values({
        nationId: input.nationId,
        authorOrgId: input.authorOrgId,
        authorProfileId: input.authorProfileId,
        title: input.title.trim(),
        content: input.content.trim(),
        rewardAmount: input.rewardAmount ?? 0,
        status: MarketPostStatus.Open,
        category: input.category,
      })
      .returning()

    return {
      success: true,
      data: { postId: post.id },
    }
  } catch (error) {
    console.error('マーケット投稿作成エラー:', error)
    return { success: false, error: 'マーケット投稿の作成に失敗しました' }
  }
}

/**
 * マーケット投稿一覧取得
 */
export async function getMarketPosts(
  nationId: string,
  options?: {
    status?: 'open' | 'closed' | 'completed'
    category?: string
    limit?: number
    offset?: number
  }
): Promise<ActionResult<MarketPostInfo[]>> {
  try {
    const conditions = [eq(nationMarketPosts.nationId, nationId)]
    if (options?.status) {
      conditions.push(eq(nationMarketPosts.status, options.status))
    }
    if (options?.category) {
      conditions.push(eq(nationMarketPosts.category, options.category))
    }

    const posts = await db
      .select({
        post: nationMarketPosts,
        org: organizations,
      })
      .from(nationMarketPosts)
      .leftJoin(organizations, eq(nationMarketPosts.authorOrgId, organizations.id))
      .where(and(...conditions))
      .orderBy(desc(nationMarketPosts.createdAt))
      .limit(options?.limit ?? 20)
      .offset(options?.offset ?? 0)

    return {
      success: true,
      data: posts.map((p) => ({
        id: p.post.id,
        nationId: p.post.nationId,
        authorOrgId: p.post.authorOrgId,
        authorProfileId: p.post.authorProfileId,
        title: p.post.title,
        content: p.post.content,
        rewardAmount: p.post.rewardAmount ?? 0,
        status: p.post.status,
        category: p.post.category ?? undefined,
        createdAt: p.post.createdAt!,
        authorOrgName: p.org?.name,
      })),
    }
  } catch (error) {
    console.error('マーケット投稿一覧取得エラー:', error)
    return { success: false, error: 'マーケット投稿一覧の取得に失敗しました' }
  }
}

/**
 * マーケット投稿詳細取得
 */
export async function getMarketPostById(
  postId: string
): Promise<ActionResult<MarketPostInfo & { applications: MarketApplicationInfo[] }>> {
  try {
    const [postResult] = await db
      .select({
        post: nationMarketPosts,
        org: organizations,
      })
      .from(nationMarketPosts)
      .leftJoin(organizations, eq(nationMarketPosts.authorOrgId, organizations.id))
      .where(eq(nationMarketPosts.id, postId))
      .limit(1)

    if (!postResult) {
      return { success: false, error: '投稿が見つかりません' }
    }

    const applications = await db
      .select({
        application: nationMarketApplications,
        org: organizations,
      })
      .from(nationMarketApplications)
      .leftJoin(organizations, eq(nationMarketApplications.applicantOrgId, organizations.id))
      .where(eq(nationMarketApplications.postId, postId))
      .orderBy(desc(nationMarketApplications.createdAt))

    return {
      success: true,
      data: {
        id: postResult.post.id,
        nationId: postResult.post.nationId,
        authorOrgId: postResult.post.authorOrgId,
        authorProfileId: postResult.post.authorProfileId,
        title: postResult.post.title,
        content: postResult.post.content,
        rewardAmount: postResult.post.rewardAmount ?? 0,
        status: postResult.post.status,
        category: postResult.post.category ?? undefined,
        createdAt: postResult.post.createdAt!,
        authorOrgName: postResult.org?.name,
        applications: applications.map((a) => ({
          id: a.application.id,
          postId: a.application.postId,
          applicantOrgId: a.application.applicantOrgId,
          applicantProfileId: a.application.applicantProfileId,
          message: a.application.message ?? undefined,
          status: a.application.status,
          createdAt: a.application.createdAt!,
          applicantOrgName: a.org?.name,
        })),
      },
    }
  } catch (error) {
    console.error('マーケット投稿詳細取得エラー:', error)
    return { success: false, error: 'マーケット投稿詳細の取得に失敗しました' }
  }
}

/**
 * マーケット投稿クローズ
 */
export async function closeMarketPost(
  postId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    const post = await db.query.nationMarketPosts.findFirst({
      where: eq(nationMarketPosts.id, postId),
    })

    if (!post) {
      return { success: false, error: '投稿が見つかりません' }
    }

    if (post.status !== MarketPostStatus.Open) {
      return { success: false, error: 'この投稿は既にクローズされています' }
    }

    // TODO: 権限チェック（投稿者のみ）

    await db
      .update(nationMarketPosts)
      .set({
        status: MarketPostStatus.Closed,
        closedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(nationMarketPosts.id, postId))

    return { success: true }
  } catch (error) {
    console.error('マーケット投稿クローズエラー:', error)
    return { success: false, error: 'マーケット投稿のクローズに失敗しました' }
  }
}

// =====================================================
// マーケット応募 Actions
// =====================================================

/**
 * マーケット応募
 */
export async function applyToMarketPost(
  postId: string,
  applicantOrgId: string,
  applicantProfileId: string,
  message?: string
): Promise<ActionResult<{ applicationId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    // 投稿取得
    const post = await db.query.nationMarketPosts.findFirst({
      where: eq(nationMarketPosts.id, postId),
    })

    if (!post) {
      return { success: false, error: '投稿が見つかりません' }
    }

    if (post.status !== MarketPostStatus.Open) {
      return { success: false, error: 'この投稿は募集を終了しています' }
    }

    // 組織が常駐しているかチェック
    const membership = await db.query.topdownNationMemberships.findFirst({
      where: and(
        eq(topdownNationMemberships.nationId, post.nationId),
        eq(topdownNationMemberships.organizationId, applicantOrgId),
        eq(topdownNationMemberships.membershipType, NationMembershipType.Resident)
      ),
    })

    if (!membership) {
      return { success: false, error: '常駐組織のみが応募できます' }
    }

    // 自己応募チェック
    if (post.authorOrgId === applicantOrgId) {
      return { success: false, error: '自分の投稿には応募できません' }
    }

    // 重複応募チェック
    const existingApplication = await db.query.nationMarketApplications.findFirst({
      where: and(
        eq(nationMarketApplications.postId, postId),
        eq(nationMarketApplications.applicantOrgId, applicantOrgId)
      ),
    })

    if (existingApplication) {
      return { success: false, error: '既に応募しています' }
    }

    const [application] = await db
      .insert(nationMarketApplications)
      .values({
        postId,
        applicantOrgId,
        applicantProfileId,
        message,
        status: 'pending',
      })
      .returning()

    return {
      success: true,
      data: { applicationId: application.id },
    }
  } catch (error) {
    console.error('マーケット応募エラー:', error)
    return { success: false, error: 'マーケット応募に失敗しました' }
  }
}

/**
 * 応募承認
 */
export async function acceptApplication(
  applicationId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    const application = await db.query.nationMarketApplications.findFirst({
      where: eq(nationMarketApplications.id, applicationId),
    })

    if (!application) {
      return { success: false, error: '応募が見つかりません' }
    }

    if (application.status !== 'pending') {
      return { success: false, error: 'この応募は既に処理されています' }
    }

    // TODO: 権限チェック（投稿者のみ）

    await db
      .update(nationMarketApplications)
      .set({ status: 'accepted' })
      .where(eq(nationMarketApplications.id, applicationId))

    return { success: true }
  } catch (error) {
    console.error('応募承認エラー:', error)
    return { success: false, error: '応募の承認に失敗しました' }
  }
}

/**
 * 応募拒否
 */
export async function rejectApplication(
  applicationId: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    const application = await db.query.nationMarketApplications.findFirst({
      where: eq(nationMarketApplications.id, applicationId),
    })

    if (!application) {
      return { success: false, error: '応募が見つかりません' }
    }

    if (application.status !== 'pending') {
      return { success: false, error: 'この応募は既に処理されています' }
    }

    await db
      .update(nationMarketApplications)
      .set({ status: 'rejected' })
      .where(eq(nationMarketApplications.id, applicationId))

    return { success: true }
  } catch (error) {
    console.error('応募拒否エラー:', error)
    return { success: false, error: '応募の拒否に失敗しました' }
  }
}

// =====================================================
// 取引完了・税徴収 Actions
// =====================================================

/**
 * マーケット取引完了 (FR-130-030)
 * 報酬支払い・税金徴収を行う
 */
export async function completeMarketTransaction(
  postId: string,
  applicationId: string
): Promise<ActionResult<{ taxAmount: number; netReward: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  try {
    let taxAmount = 0
    let netReward = 0

    await db.transaction(async (tx) => {
      // 投稿取得
      const post = await tx.query.nationMarketPosts.findFirst({
        where: eq(nationMarketPosts.id, postId),
      })

      if (!post) {
        throw new Error('投稿が見つかりません')
      }

      // 応募取得
      const application = await tx.query.nationMarketApplications.findFirst({
        where: eq(nationMarketApplications.id, applicationId),
      })

      if (!application) {
        throw new Error('応募が見つかりません')
      }

      if (application.status !== 'accepted') {
        throw new Error('承認済みの応募のみ完了できます')
      }

      // 国情報取得（税率）
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, post.nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      const rewardAmount = post.rewardAmount ?? 0
      taxAmount = calculateMarketTax(rewardAmount, nation.marketTaxRate ?? 5)
      netReward = rewardAmount - taxAmount

      // 報酬がある場合のみ処理
      if (rewardAmount > 0) {
        // 投稿者の銀行口座取得
        const authorAccount = await tx.query.nationBankAccounts.findFirst({
          where: and(
            eq(nationBankAccounts.nationId, post.nationId),
            eq(nationBankAccounts.ownerType, 'organization'),
            eq(nationBankAccounts.ownerId, post.authorOrgId)
          ),
        })

        if (!authorAccount) {
          throw new Error('投稿者の銀行口座が見つかりません')
        }

        // 残高チェック
        if (authorAccount.balance < rewardAmount) {
          throw new Error('投稿者の残高が不足しています')
        }

        // 応募者の銀行口座取得
        const applicantAccount = await tx.query.nationBankAccounts.findFirst({
          where: and(
            eq(nationBankAccounts.nationId, post.nationId),
            eq(nationBankAccounts.ownerType, 'organization'),
            eq(nationBankAccounts.ownerId, application.applicantOrgId)
          ),
        })

        if (!applicantAccount) {
          throw new Error('応募者の銀行口座が見つかりません')
        }

        // 国庫口座取得
        const treasuryAccount = await tx.query.nationBankAccounts.findFirst({
          where: and(
            eq(nationBankAccounts.nationId, post.nationId),
            eq(nationBankAccounts.ownerType, 'nation')
          ),
        })

        if (!treasuryAccount) {
          throw new Error('国庫口座が見つかりません')
        }

        // 投稿者から引き落とし
        const authorBalanceBefore = authorAccount.balance
        const authorBalanceAfter = authorBalanceBefore - rewardAmount

        await tx
          .update(nationBankAccounts)
          .set({ balance: authorBalanceAfter })
          .where(eq(nationBankAccounts.id, authorAccount.id))

        await tx.insert(nationBankTransactions).values({
          accountId: authorAccount.id,
          type: BankTransactionType.Transfer,
          amount: -rewardAmount,
          balanceBefore: authorBalanceBefore,
          balanceAfter: authorBalanceAfter,
          description: `マーケット報酬支払い: ${post.title}`,
        })

        // 応募者へ報酬（税引き後）
        const applicantBalanceBefore = applicantAccount.balance
        const applicantBalanceAfter = applicantBalanceBefore + netReward

        await tx
          .update(nationBankAccounts)
          .set({ balance: applicantBalanceAfter })
          .where(eq(nationBankAccounts.id, applicantAccount.id))

        await tx.insert(nationBankTransactions).values({
          accountId: applicantAccount.id,
          type: BankTransactionType.Transfer,
          amount: netReward,
          balanceBefore: applicantBalanceBefore,
          balanceAfter: applicantBalanceAfter,
          relatedAccountId: authorAccount.id,
          description: `マーケット報酬受取: ${post.title}`,
        })

        // 国庫へ税金
        if (taxAmount > 0) {
          const treasuryBalanceBefore = treasuryAccount.balance
          const treasuryBalanceAfter = treasuryBalanceBefore + taxAmount

          await tx
            .update(nationBankAccounts)
            .set({ balance: treasuryBalanceAfter })
            .where(eq(nationBankAccounts.id, treasuryAccount.id))

          await tx.insert(nationBankTransactions).values({
            accountId: treasuryAccount.id,
            type: BankTransactionType.Tax,
            amount: taxAmount,
            balanceBefore: treasuryBalanceBefore,
            balanceAfter: treasuryBalanceAfter,
            description: `マーケット取引税: ${post.title}`,
          })
        }
      }

      // 投稿を完了に
      await tx
        .update(nationMarketPosts)
        .set({
          status: MarketPostStatus.Completed,
          closedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(nationMarketPosts.id, postId))

      // 応募を完了に
      await tx
        .update(nationMarketApplications)
        .set({ status: 'completed' })
        .where(eq(nationMarketApplications.id, applicationId))
    })

    return {
      success: true,
      data: { taxAmount, netReward },
    }
  } catch (error) {
    console.error('取引完了エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : '取引完了に失敗しました' }
  }
}

// =====================================================
// 評価 Actions
// =====================================================

/**
 * 取引評価
 */
export async function rateMarketTransaction(
  postId: string,
  raterProfileId: string,
  rateeProfileId: string,
  rating: number,
  comment?: string
): Promise<ActionResult<{ ratingId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (rating < 1 || rating > 5) {
    return { success: false, error: '評価は1〜5の間で指定してください' }
  }

  try {
    // 重複評価チェック
    const existingRating = await db.query.nationMarketRatings.findFirst({
      where: and(
        eq(nationMarketRatings.postId, postId),
        eq(nationMarketRatings.raterProfileId, raterProfileId),
        eq(nationMarketRatings.rateeProfileId, rateeProfileId)
      ),
    })

    if (existingRating) {
      return { success: false, error: '既に評価済みです' }
    }

    const [ratingRecord] = await db
      .insert(nationMarketRatings)
      .values({
        postId,
        raterProfileId,
        rateeProfileId,
        rating,
        comment,
      })
      .returning()

    return {
      success: true,
      data: { ratingId: ratingRecord.id },
    }
  } catch (error) {
    console.error('評価エラー:', error)
    return { success: false, error: '評価に失敗しました' }
  }
}

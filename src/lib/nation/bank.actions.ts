'use server'

/**
 * 国銀行 Server Actions
 * 設計書: 0130-02-トップダウン国（内政）設計書.md
 */

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import {
  nationBankAccounts,
  nationBankTransactions,
  nationLoans,
  topdownNations,
  rootAccounts,
  profiles,
} from '@/db/schema'
import { eq, and, desc, sql } from 'drizzle-orm'
import {
  checkSufficientBalance,
  calculateLoanLimit,
  calculateTransactionFee,
} from './topdown.logic'
import { BankTransactionType } from '@/db/constants'

// =====================================================
// 型定義
// =====================================================

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

export interface BankAccountInfo {
  id: string
  nationId: string
  ownerType: string
  ownerId: string
  balance: number
  createdAt: Date
}

export interface BankTransactionInfo {
  id: string
  type: string
  amount: number
  balanceBefore: number
  balanceAfter: number
  description?: string
  createdAt: Date
}

// =====================================================
// 銀行口座 Actions
// =====================================================

/**
 * 銀行口座情報取得
 */
export async function getBankAccount(
  accountId: string
): Promise<ActionResult<BankAccountInfo>> {
  try {
    const account = await db.query.nationBankAccounts.findFirst({
      where: eq(nationBankAccounts.id, accountId),
    })

    if (!account) {
      return { success: false, error: '口座が見つかりません' }
    }

    return {
      success: true,
      data: {
        id: account.id,
        nationId: account.nationId,
        ownerType: account.ownerType,
        ownerId: account.ownerId,
        balance: account.balance,
        createdAt: account.createdAt!,
      },
    }
  } catch (error) {
    console.error('口座情報取得エラー:', error)
    return { success: false, error: '口座情報の取得に失敗しました' }
  }
}

/**
 * 組織の銀行口座取得（国内）
 */
export async function getOrganizationBankAccount(
  nationId: string,
  organizationId: string
): Promise<ActionResult<BankAccountInfo>> {
  try {
    const account = await db.query.nationBankAccounts.findFirst({
      where: and(
        eq(nationBankAccounts.nationId, nationId),
        eq(nationBankAccounts.ownerType, 'organization'),
        eq(nationBankAccounts.ownerId, organizationId)
      ),
    })

    if (!account) {
      return { success: false, error: '口座が見つかりません' }
    }

    return {
      success: true,
      data: {
        id: account.id,
        nationId: account.nationId,
        ownerType: account.ownerType,
        ownerId: account.ownerId,
        balance: account.balance,
        createdAt: account.createdAt!,
      },
    }
  } catch (error) {
    console.error('組織口座取得エラー:', error)
    return { success: false, error: '組織口座の取得に失敗しました' }
  }
}

/**
 * 国庫口座取得
 */
export async function getNationTreasuryAccount(
  nationId: string
): Promise<ActionResult<BankAccountInfo>> {
  try {
    const account = await db.query.nationBankAccounts.findFirst({
      where: and(
        eq(nationBankAccounts.nationId, nationId),
        eq(nationBankAccounts.ownerType, 'nation'),
        eq(nationBankAccounts.ownerId, nationId)
      ),
    })

    if (!account) {
      return { success: false, error: '国庫口座が見つかりません' }
    }

    return {
      success: true,
      data: {
        id: account.id,
        nationId: account.nationId,
        ownerType: account.ownerType,
        ownerId: account.ownerId,
        balance: account.balance,
        createdAt: account.createdAt!,
      },
    }
  } catch (error) {
    console.error('国庫口座取得エラー:', error)
    return { success: false, error: '国庫口座の取得に失敗しました' }
  }
}

// =====================================================
// 入出金 Actions
// =====================================================

/**
 * 預入 (FR-130-031)
 */
export async function depositToBank(
  accountId: string,
  amount: number,
  description?: string
): Promise<ActionResult<{ transactionId: string; newBalance: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (amount <= 0) {
    return { success: false, error: '預入額は正の数である必要があります' }
  }

  try {
    let transactionId = ''
    let newBalance = 0

    await db.transaction(async (tx) => {
      // 口座取得
      const account = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, accountId),
      })

      if (!account) {
        throw new Error('口座が見つかりません')
      }

      const balanceBefore = account.balance
      newBalance = balanceBefore + amount

      // 残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: newBalance })
        .where(eq(nationBankAccounts.id, accountId))

      // 取引履歴作成
      const [transaction] = await tx
        .insert(nationBankTransactions)
        .values({
          accountId,
          type: BankTransactionType.Deposit,
          amount,
          balanceBefore,
          balanceAfter: newBalance,
          description: description ?? '預入',
        })
        .returning()

      transactionId = transaction.id
    })

    return {
      success: true,
      data: { transactionId, newBalance },
    }
  } catch (error) {
    console.error('預入エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : '預入に失敗しました' }
  }
}

/**
 * 引出 (FR-130-031)
 */
export async function withdrawFromBank(
  accountId: string,
  amount: number,
  description?: string
): Promise<ActionResult<{ transactionId: string; newBalance: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (amount <= 0) {
    return { success: false, error: '引出額は正の数である必要があります' }
  }

  try {
    let transactionId = ''
    let newBalance = 0

    await db.transaction(async (tx) => {
      // 口座取得
      const account = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, accountId),
      })

      if (!account) {
        throw new Error('口座が見つかりません')
      }

      const balanceBefore = account.balance

      // 残高チェック
      if (!checkSufficientBalance(balanceBefore, amount)) {
        throw new Error('残高が不足しています')
      }

      newBalance = balanceBefore - amount

      // 残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: newBalance })
        .where(eq(nationBankAccounts.id, accountId))

      // 取引履歴作成
      const [transaction] = await tx
        .insert(nationBankTransactions)
        .values({
          accountId,
          type: BankTransactionType.Withdrawal,
          amount: -amount,
          balanceBefore,
          balanceAfter: newBalance,
          description: description ?? '引出',
        })
        .returning()

      transactionId = transaction.id
    })

    return {
      success: true,
      data: { transactionId, newBalance },
    }
  } catch (error) {
    console.error('引出エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : '引出に失敗しました' }
  }
}

/**
 * 振込
 */
export async function transferBetweenAccounts(
  fromAccountId: string,
  toAccountId: string,
  amount: number,
  description?: string
): Promise<ActionResult<{ transactionId: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (amount <= 0) {
    return { success: false, error: '振込額は正の数である必要があります' }
  }

  if (fromAccountId === toAccountId) {
    return { success: false, error: '同一口座への振込はできません' }
  }

  try {
    let transactionId = ''

    await db.transaction(async (tx) => {
      // 送金元口座取得
      const fromAccount = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, fromAccountId),
      })

      if (!fromAccount) {
        throw new Error('送金元口座が見つかりません')
      }

      // 送金先口座取得
      const toAccount = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, toAccountId),
      })

      if (!toAccount) {
        throw new Error('送金先口座が見つかりません')
      }

      // 残高チェック
      if (!checkSufficientBalance(fromAccount.balance, amount)) {
        throw new Error('残高が不足しています')
      }

      const fromBalanceBefore = fromAccount.balance
      const toBalanceBefore = toAccount.balance
      const fromBalanceAfter = fromBalanceBefore - amount
      const toBalanceAfter = toBalanceBefore + amount

      // 送金元残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: fromBalanceAfter })
        .where(eq(nationBankAccounts.id, fromAccountId))

      // 送金先残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: toBalanceAfter })
        .where(eq(nationBankAccounts.id, toAccountId))

      // 送金元取引履歴
      const [fromTransaction] = await tx
        .insert(nationBankTransactions)
        .values({
          accountId: fromAccountId,
          type: BankTransactionType.Transfer,
          amount: -amount,
          balanceBefore: fromBalanceBefore,
          balanceAfter: fromBalanceAfter,
          relatedAccountId: toAccountId,
          description: description ?? '振込（送金）',
        })
        .returning()

      transactionId = fromTransaction.id

      // 送金先取引履歴
      await tx.insert(nationBankTransactions).values({
        accountId: toAccountId,
        type: BankTransactionType.Transfer,
        amount,
        balanceBefore: toBalanceBefore,
        balanceAfter: toBalanceAfter,
        relatedAccountId: fromAccountId,
        description: description ?? '振込（受取）',
      })
    })

    return {
      success: true,
      data: { transactionId },
    }
  } catch (error) {
    console.error('振込エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : '振込に失敗しました' }
  }
}

// =====================================================
// ローン Actions
// =====================================================

/**
 * ローン申請 (FR-130-031)
 */
export async function applyForLoan(
  accountId: string,
  amount: number,
  reason: string,
  dueDate?: Date
): Promise<ActionResult<{ loanId: string; newBalance: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (amount <= 0) {
    return { success: false, error: 'ローン額は正の数である必要があります' }
  }

  try {
    let loanId = ''
    let newBalance = 0

    await db.transaction(async (tx) => {
      // 口座取得
      const account = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, accountId),
      })

      if (!account) {
        throw new Error('口座が見つかりません')
      }

      // ローン限度額チェック（簡易版: 現在残高の2倍まで）
      const loanLimit = calculateLoanLimit(account.balance, 10, 100)
      if (amount > loanLimit) {
        throw new Error(`ローン限度額を超えています（限度額: ${loanLimit}）`)
      }

      // 既存の未返済ローンチェック
      const existingLoans = await tx.query.nationLoans.findMany({
        where: and(
          eq(nationLoans.accountId, accountId),
          eq(nationLoans.status, 'active')
        ),
      })

      const totalOutstanding = existingLoans.reduce((sum, loan) => sum + loan.remainingAmount, 0)
      if (totalOutstanding + amount > loanLimit) {
        throw new Error('既存ローンとの合計が限度額を超えます')
      }

      const balanceBefore = account.balance
      newBalance = balanceBefore + amount

      // 残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: newBalance })
        .where(eq(nationBankAccounts.id, accountId))

      // ローンレコード作成
      const [loan] = await tx
        .insert(nationLoans)
        .values({
          accountId,
          principalAmount: amount,
          remainingAmount: amount,
          reason,
          status: 'active',
          dueDate: dueDate ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // デフォルト30日後
        })
        .returning()

      loanId = loan.id

      // 取引履歴作成
      await tx.insert(nationBankTransactions).values({
        accountId,
        type: BankTransactionType.Loan,
        amount,
        balanceBefore,
        balanceAfter: newBalance,
        description: `ローン借入: ${reason}`,
      })
    })

    return {
      success: true,
      data: { loanId, newBalance },
    }
  } catch (error) {
    console.error('ローン申請エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : 'ローン申請に失敗しました' }
  }
}

/**
 * ローン返済
 */
export async function repayLoan(
  loanId: string,
  amount: number
): Promise<ActionResult<{ remainingAmount: number; newBalance: number }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  if (amount <= 0) {
    return { success: false, error: '返済額は正の数である必要があります' }
  }

  try {
    let remainingAmount = 0
    let newBalance = 0

    await db.transaction(async (tx) => {
      // ローン取得
      const loan = await tx.query.nationLoans.findFirst({
        where: eq(nationLoans.id, loanId),
      })

      if (!loan) {
        throw new Error('ローンが見つかりません')
      }

      if (loan.status !== 'active') {
        throw new Error('このローンは既に返済済みです')
      }

      // 口座取得
      const account = await tx.query.nationBankAccounts.findFirst({
        where: eq(nationBankAccounts.id, loan.accountId),
      })

      if (!account) {
        throw new Error('口座が見つかりません')
      }

      // 残高チェック
      if (!checkSufficientBalance(account.balance, amount)) {
        throw new Error('残高が不足しています')
      }

      const repayAmount = Math.min(amount, loan.remainingAmount)
      remainingAmount = loan.remainingAmount - repayAmount
      const balanceBefore = account.balance
      newBalance = balanceBefore - repayAmount

      // 残高更新
      await tx
        .update(nationBankAccounts)
        .set({ balance: newBalance })
        .where(eq(nationBankAccounts.id, loan.accountId))

      // ローン更新
      await tx
        .update(nationLoans)
        .set({
          remainingAmount,
          status: remainingAmount === 0 ? 'repaid' : 'active',
        })
        .where(eq(nationLoans.id, loanId))

      // 取引履歴作成
      await tx.insert(nationBankTransactions).values({
        accountId: loan.accountId,
        type: BankTransactionType.LoanRepayment,
        amount: -repayAmount,
        balanceBefore,
        balanceAfter: newBalance,
        description: `ローン返済（残高: ${remainingAmount}）`,
      })
    })

    return {
      success: true,
      data: { remainingAmount, newBalance },
    }
  } catch (error) {
    console.error('ローン返済エラー:', error)
    return { success: false, error: error instanceof Error ? error.message : 'ローン返済に失敗しました' }
  }
}

// =====================================================
// 取引履歴 Actions
// =====================================================

/**
 * 取引履歴取得
 */
export async function getBankTransactions(
  accountId: string,
  options?: {
    limit?: number
    offset?: number
    type?: string
  }
): Promise<ActionResult<BankTransactionInfo[]>> {
  try {
    const conditions = [eq(nationBankTransactions.accountId, accountId)]
    if (options?.type) {
      conditions.push(eq(nationBankTransactions.type, options.type))
    }

    const transactions = await db
      .select()
      .from(nationBankTransactions)
      .where(and(...conditions))
      .orderBy(desc(nationBankTransactions.createdAt))
      .limit(options?.limit ?? 50)
      .offset(options?.offset ?? 0)

    return {
      success: true,
      data: transactions.map((t) => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        balanceBefore: t.balanceBefore,
        balanceAfter: t.balanceAfter,
        description: t.description ?? undefined,
        createdAt: t.createdAt!,
      })),
    }
  } catch (error) {
    console.error('取引履歴取得エラー:', error)
    return { success: false, error: '取引履歴の取得に失敗しました' }
  }
}

/**
 * ローン一覧取得
 */
export async function getLoans(
  accountId: string,
  status?: 'active' | 'repaid' | 'defaulted'
): Promise<ActionResult<typeof nationLoans.$inferSelect[]>> {
  try {
    const conditions = [eq(nationLoans.accountId, accountId)]
    if (status) {
      conditions.push(eq(nationLoans.status, status))
    }

    const loans = await db
      .select()
      .from(nationLoans)
      .where(and(...conditions))
      .orderBy(desc(nationLoans.createdAt))

    return { success: true, data: loans }
  } catch (error) {
    console.error('ローン一覧取得エラー:', error)
    return { success: false, error: 'ローン一覧の取得に失敗しました' }
  }
}

// =====================================================
// Task 9.1: ポイント徴収 Actions (FR-130-003, FR-130-007)
// =====================================================

import {
  calculateMonthlyMaintenanceFee,
  calculateResidencyFee,
  calculateFeeCollectionResult,
  determineNationStatusAfterCollection,
  GRACE_PERIOD_DAYS,
} from './topdown.logic'

/**
 * 維持費徴収結果の型
 */
export interface MaintenanceFeeCollectionResult {
  nationId: string
  feeAmount: number
  collected: number
  shortfall: number
  success: boolean
  newStatus: 'active' | 'suspended' | 'archived'
  gracePeriodEndDate: Date | null
}

/**
 * 月次維持費を徴収 (FR-130-003)
 * 国の銀行口座（国庫）から維持費を徴収する
 */
export async function collectMonthlyMaintenanceFee(
  nationId: string
): Promise<ActionResult<MaintenanceFeeCollectionResult>> {
  try {
    let result: MaintenanceFeeCollectionResult | null = null

    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      if (nation.status === 'archived') {
        throw new Error('アーカイブ済みの国からは徴収できません')
      }

      // 維持費を計算
      const feeAmount = calculateMonthlyMaintenanceFee(
        nation.scaleLevel,
        nation.residentOrgCount ?? 0
      )

      // 国庫口座取得
      const treasuryAccount = await tx.query.nationBankAccounts.findFirst({
        where: and(
          eq(nationBankAccounts.nationId, nationId),
          eq(nationBankAccounts.ownerType, 'nation'),
          eq(nationBankAccounts.ownerId, nationId)
        ),
      })

      if (!treasuryAccount) {
        throw new Error('国庫口座が見つかりません')
      }

      // 徴収結果を計算
      const collectionResult = calculateFeeCollectionResult(
        treasuryAccount.balance,
        feeAmount
      )

      // 初回失敗からの日数を計算（簡略化: 猶予期間開始日がある場合のみ計算）
      const gracePeriodStartDate = nation.gracePeriodStartDate
      let daysSinceFirstFailure = 0
      if (gracePeriodStartDate) {
        const now = new Date()
        daysSinceFirstFailure = Math.floor(
          (now.getTime() - gracePeriodStartDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      }

      // 国ステータスを判定
      const statusResult = determineNationStatusAfterCollection(
        collectionResult.success,
        daysSinceFirstFailure,
        nation.status as 'active' | 'suspended' | 'archived'
      )

      // 口座残高を更新
      const newBalance = treasuryAccount.balance - collectionResult.collected
      await tx
        .update(nationBankAccounts)
        .set({ balance: newBalance })
        .where(eq(nationBankAccounts.id, treasuryAccount.id))

      // 取引履歴を記録
      await tx.insert(nationBankTransactions).values({
        accountId: treasuryAccount.id,
        type: BankTransactionType.MaintenanceFee,
        amount: -collectionResult.collected,
        balanceBefore: treasuryAccount.balance,
        balanceAfter: newBalance,
        description: `月次維持費 (規模レベル: ${nation.scaleLevel}, 常駐組織数: ${nation.residentOrgCount})`,
      })

      // 国ステータスを更新
      const updateData: Record<string, unknown> = {
        status: statusResult.status,
        updatedAt: new Date(),
      }

      // 初回失敗時は猶予期間開始日を設定
      if (!collectionResult.success && !nation.gracePeriodStartDate) {
        updateData.gracePeriodStartDate = new Date()
      }

      // 徴収成功時は猶予期間をリセット
      if (collectionResult.success && nation.gracePeriodStartDate) {
        updateData.gracePeriodStartDate = null
      }

      await tx
        .update(topdownNations)
        .set(updateData)
        .where(eq(topdownNations.id, nationId))

      result = {
        nationId,
        feeAmount,
        collected: collectionResult.collected,
        shortfall: collectionResult.shortfall,
        success: collectionResult.success,
        newStatus: statusResult.status,
        gracePeriodEndDate: statusResult.gracePeriodEndDate,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('維持費徴収エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '維持費の徴収に失敗しました',
    }
  }
}

/**
 * 常駐料金徴収結果の型
 */
export interface ResidencyFeeCollectionResult {
  organizationId: string
  nationId: string
  feeAmount: number
  collected: number
  shortfall: number
  success: boolean
}

/**
 * 常駐料金を徴収 (FR-130-007)
 * 組織の銀行口座から常駐料金を徴収し、国庫に入金する
 */
export async function collectResidencyFee(
  nationId: string,
  organizationId: string,
  months: number = 1
): Promise<ActionResult<ResidencyFeeCollectionResult>> {
  try {
    let result: ResidencyFeeCollectionResult | null = null

    await db.transaction(async (tx) => {
      // 国情報取得
      const nation = await tx.query.topdownNations.findFirst({
        where: eq(topdownNations.id, nationId),
      })

      if (!nation) {
        throw new Error('国が見つかりません')
      }

      // 常駐料金を計算
      const feeAmount = calculateResidencyFee(nation.residencyFee ?? 0, months)

      // 常駐料金が0の場合はスキップ
      if (feeAmount === 0) {
        result = {
          organizationId,
          nationId,
          feeAmount: 0,
          collected: 0,
          shortfall: 0,
          success: true,
        }
        return
      }

      // 組織の銀行口座取得
      const orgAccount = await tx.query.nationBankAccounts.findFirst({
        where: and(
          eq(nationBankAccounts.nationId, nationId),
          eq(nationBankAccounts.ownerType, 'organization'),
          eq(nationBankAccounts.ownerId, organizationId)
        ),
      })

      if (!orgAccount) {
        throw new Error('組織の銀行口座が見つかりません')
      }

      // 国庫口座取得
      const treasuryAccount = await tx.query.nationBankAccounts.findFirst({
        where: and(
          eq(nationBankAccounts.nationId, nationId),
          eq(nationBankAccounts.ownerType, 'nation'),
          eq(nationBankAccounts.ownerId, nationId)
        ),
      })

      if (!treasuryAccount) {
        throw new Error('国庫口座が見つかりません')
      }

      // 徴収結果を計算
      const collectionResult = calculateFeeCollectionResult(
        orgAccount.balance,
        feeAmount
      )

      // 組織口座から引き落とし
      const orgNewBalance = orgAccount.balance - collectionResult.collected
      await tx
        .update(nationBankAccounts)
        .set({ balance: orgNewBalance })
        .where(eq(nationBankAccounts.id, orgAccount.id))

      // 組織の取引履歴
      await tx.insert(nationBankTransactions).values({
        accountId: orgAccount.id,
        type: BankTransactionType.MaintenanceFee,
        amount: -collectionResult.collected,
        balanceBefore: orgAccount.balance,
        balanceAfter: orgNewBalance,
        relatedAccountId: treasuryAccount.id,
        description: `常駐料金 (${months}ヶ月分)`,
      })

      // 国庫に入金
      const treasuryNewBalance = treasuryAccount.balance + collectionResult.collected
      await tx
        .update(nationBankAccounts)
        .set({ balance: treasuryNewBalance })
        .where(eq(nationBankAccounts.id, treasuryAccount.id))

      // 国庫の取引履歴
      await tx.insert(nationBankTransactions).values({
        accountId: treasuryAccount.id,
        type: BankTransactionType.MaintenanceFee,
        amount: collectionResult.collected,
        balanceBefore: treasuryAccount.balance,
        balanceAfter: treasuryNewBalance,
        relatedAccountId: orgAccount.id,
        description: `常駐料金受領 (組織ID: ${organizationId}, ${months}ヶ月分)`,
      })

      result = {
        organizationId,
        nationId,
        feeAmount,
        collected: collectionResult.collected,
        shortfall: collectionResult.shortfall,
        success: collectionResult.success,
      }
    })

    return { success: true, data: result! }
  } catch (error) {
    console.error('常駐料金徴収エラー:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '常駐料金の徴収に失敗しました',
    }
  }
}

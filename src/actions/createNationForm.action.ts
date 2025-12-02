'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { rootAccounts, profiles, rootAccountPoints, pointTransactions, nations, aclNationRoleAssignments } from '@/db/schema'
import { eq } from 'drizzle-orm'

// 建国費用（ポイント）
const NATION_CREATION_COST = 10000

export interface CreateNationFormResult {
  success: boolean
  nationId?: string
  error?: string
}

export async function createNationFormAction(formData: FormData): Promise<CreateNationFormResult> {
  // 1. ユーザー認証チェック
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'ユーザー認証が必要です' }
  }

  // 2. フォームデータ取得
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const nationType = formData.get('nationType') as string
  const vision = formData.get('vision') as string
  const rules = formData.get('rules') as string
  const agreeOasis = formData.get('agreeOasis') === 'true'
  const agreeTerms = formData.get('agreeTerms') === 'true'

  // 3. バリデーション
  if (!name || name.trim() === '') {
    return { success: false, error: '国名は必須です' }
  }

  if (!agreeOasis) {
    return { success: false, error: 'オアシス宣言への同意が必要です' }
  }

  if (!agreeTerms) {
    return { success: false, error: '建国規約への同意が必要です' }
  }

  // 4. ルートアカウント取得
  const rootAccount = await db.query.rootAccounts.findFirst({
    where: eq(rootAccounts.userId, user.id)
  })

  if (!rootAccount) {
    return { success: false, error: 'ルートアカウントが見つかりません' }
  }

  // 5. プロフィール取得（主権者ロール付与用）
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.rootAccountId, rootAccount.id)
  })

  // 6. ポイント残高チェック
  const pointsRow = await db.query.rootAccountPoints.findFirst({
    where: eq(rootAccountPoints.rootAccountId, rootAccount.id)
  })

  const balance = pointsRow?.balance ?? 0
  if (balance < NATION_CREATION_COST) {
    return { success: false, error: `建国には${NATION_CREATION_COST}ポイントが必要です（現在: ${balance}ポイント）` }
  }

  // 7. トランザクションで建国処理
  try {
    let nationId: string = ''

    await db.transaction(async (tx) => {
      // 国を作成
      const [newNation] = await tx.insert(nations).values({
        name: name.trim(),
        description: description || null,
        leaderOrganizationId: null,
        levelId: 'Village', // デフォルトは村から
      }).returning()

      nationId = newNation.id

      // ポイント履歴を記録
      await tx.insert(pointTransactions).values({
        rootAccountId: rootAccount.id,
        delta: -NATION_CREATION_COST,
        reason: 'FOUND_NATION',
        relatedEntity: 'nation',
        relatedId: nationId,
      })

      // 残高を減算
      await tx.update(rootAccountPoints)
        .set({ balance: balance - NATION_CREATION_COST })
        .where(eq(rootAccountPoints.rootAccountId, rootAccount.id))

      // プロフィールがあれば主権者ロールを付与
      if (profile) {
        await tx.insert(aclNationRoleAssignments).values({
          nationId: nationId,
          profileId: profile.id,
          roleId: 'sovereign',
        })
      }
    })

    return { success: true, nationId }
  } catch (error) {
    console.error('Nation creation failed:', error)
    return { success: false, error: '建国処理中にエラーが発生しました' }
  }
}

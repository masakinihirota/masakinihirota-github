import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isUserAdmin } from '@/lib/rbac/adminAuth'

/**
 * 管理者エリアのレイアウト
 * Server Component で二重チェックを行い、middleware をバイパスされた場合でも
 * 非管理者ユーザーをブロックする
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未認証ユーザーはログインページへ
  if (!user) {
    redirect('/login')
  }

  // 管理者権限チェック
  const isAdmin = await isUserAdmin(user.id)
  if (!isAdmin) {
    // 非管理者は /home へリダイレクト
    redirect('/home')
  }

  return <>{children}</>
}

// import { redirect } from 'next/navigation'
// import { createClient } from '@/lib/supabase/server'
// import { isUserAdmin } from '@/lib/rbac/adminAuth'

/**
 * 管理者エリアのレイアウト
 * 開発環境では認証・権限チェックをスキップ
 * TODO: 本番環境では認証チェックを有効にする
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 開発環境では認証チェックをスキップ
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // // 未認証ユーザーはログインページへ
  // if (!user) {
  //   redirect('/login')
  // }

  // // 管理者権限チェック
  // const isAdmin = await isUserAdmin(user.id)
  // if (!isAdmin) {
  //   // 非管理者は /home へリダイレクト
  //   redirect('/home')
  // }

  return <>{children}</>
}

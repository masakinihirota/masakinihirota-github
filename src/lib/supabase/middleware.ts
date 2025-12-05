import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
// import { isUserAdmin } from '@/lib/rbac/adminAuth'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 公開パス（認証不要）
  const publicPaths = [
    '/',
    '/login',
    '/register',
    '/auth',
    '/onboarding/guest',
    '/terms',
    '/privacy',
    '/about',
    '/contact',
    '/help',
    '/oasis',
    '/oasis-declaration',
    '/human-declaration',
    '/search',
    '/pricing',
    '/recommendations',
    '/group',       // /group/[groupCode] 公開組織
    '/works',       // /works/[workId] 公開作品
    '/values',      // /values/[valueId] 公開価値観
    '/skills',      // /skills/[skillId] 公開スキル
    '/lists',       // /lists/[listId] 公開リスト
    '/chains',      // /chains/[chainId] 公開チェーン
    '/nations',     // /nations 公開国ディレクトリ
    '/alliances',   // /alliances/[allianceId] 公開アライアンス
    '/root-accounts', // /root-accounts/[id] 公開プロフィール
    '/public',      // /public/* 静的公開ページ
  ]

  // パスが公開パスのいずれかで始まるかチェック
  const isPublicPath = publicPaths.some((path) => {
    if (path === '/') return pathname === '/'
    return pathname === path || pathname.startsWith(`${path}/`)
  })

  // 開発用ページを本番ではブロック
  const isDevOnlyPath =
    pathname.startsWith('/playground') ||
    pathname.startsWith('/playground-github-copilot') ||
    pathname.includes('(99-prototypes)')

  if (process.env.NODE_ENV === 'production' && isDevOnlyPath) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  if (!user && !isPublicPath) {
    // no user, potentially respond by redirecting the user to the login page
    // BYPASS: In development, allow access without login for UI testing
    if (process.env.NODE_ENV === 'development') {
      return supabaseResponse
    }

    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 管理者エリアのロールチェック（開発環境ではスキップ）
  // TODO: 本番環境では認証チェックを有効にする
  // if (pathname.startsWith('/admin') && user) {
  //   const isAdmin = await isUserAdmin(user.id)
  //   if (!isAdmin) {
  //     // 非管理者は /home にリダイレクト
  //     const url = request.nextUrl.clone()
  //     url.pathname = '/home'
  //     return NextResponse.redirect(url)
  //   }
  // }

  return supabaseResponse
}

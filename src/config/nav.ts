export type NavItem = { label: string; href: string };

export const publicNav: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "このサービスについて", href: "/about" },
  { label: "オアシス宣言", href: "/oasis" },
  { label: "説明ページ (Help)", href: "/help" },
  { label: "ログイン", href: "/login" },
  { label: "新規会員登録", href: "/register" },
];

export type AuthNavItem = NavItem & { frequent?: boolean; group?: 'main' | 'feature' | 'more' | 'footer' };

// 認証済みユーザー用メニュー（画面遷移図に基づく）
export const authNav: AuthNavItem[] = [
  // メインメニュー
  { label: "ホーム", href: "/home", frequent: true, group: 'main' },
  { label: "プロフィール（千の仮面）", href: "/user-profiles", frequent: true, group: 'main' },
  { label: "マッチング", href: "/matching", frequent: true, group: 'main' },
  { label: "おすすめ", href: "/recommendations", frequent: true, group: 'main' },
  { label: "検索", href: "/search", frequent: true, group: 'main' },
  { label: "国（トップダウン）", href: "/nations", frequent: true, group: 'main' },
  { label: "組織", href: "/groups", frequent: true, group: 'main' },
  // 登録系（feature）
  { label: "作品", href: "/works", frequent: true, group: 'feature' },
  { label: "価値観", href: "/values", frequent: true, group: 'feature' },
  { label: "スキル", href: "/skills", frequent: true, group: 'feature' },
  // もっと見る（more）
  { label: "リスト", href: "/lists", frequent: false, group: 'more' },
  { label: "チェーン", href: "/chains", frequent: false, group: 'more' },
  { label: "マンダラチャート", href: "/mandala", frequent: false, group: 'more' },
  { label: "実績", href: "/achievements", frequent: false, group: 'more' },
  { label: "通知", href: "/notifications", frequent: false, group: 'more' },
  { label: "チュートリアル", href: "/tutorial", frequent: false, group: 'more' },
  // フッター
  { label: "設定", href: "/settings", frequent: false, group: 'footer' },
  { label: "プライシング", href: "/pricing", frequent: false, group: 'footer' },
  { label: "ルートアカウント", href: "/root-accounts", frequent: false, group: 'footer' },
  { label: "ヘルプ", href: "/help", frequent: false, group: 'footer' },
];

// 公開フッターメニュー
export const footerNav: NavItem[] = [
  { label: 'このサービスについて', href: '/about' },
  { label: 'オアシス宣言', href: '/oasis' },
  { label: 'ヘルプ', href: '/help' },
  { label: 'プライバシー', href: '/privacy' },
  { label: '利用規約', href: '/terms' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default { publicNav, authNav, footerNav };

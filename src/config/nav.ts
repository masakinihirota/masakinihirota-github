export type NavItem = { label: string; href: string };

export const publicNav: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "このサービスについて", href: "/about" },
  { label: "千の仮面（プロフィール）", href: "/profiles" },
  { label: "作品登録", href: "/works" },
  { label: "マッチング", href: "/matching" },
  { label: "組織", href: "/organizations" },
  { label: "国（トップダウン）", href: "/nations" },
  { label: "オアシス宣言", href: "/oasis" },
  { label: "説明ページ (Help)", href: "/help" },
  { label: "ログイン", href: "/login" },
  { label: "新規会員登録", href: "/register" },
];

export type AuthNavItem = NavItem & { frequent?: boolean; group?: 'main'|'more' };

export const authNav: AuthNavItem[] = [
  { label: "ホーム", href: "/home", frequent: true, group: 'main' },
  { label: "プロフィール（千の仮面）", href: "/profiles", frequent: true, group: 'main' },
  { label: "国", href: "/nations", frequent: false, group: 'more' },
  { label: "組織", href: "/organizations", frequent: true, group: 'main' },
  { label: "マッチング", href: "/matching", frequent: true, group: 'main' },
  { label: "作品", href: "/works", frequent: true, group: 'main' },
  { label: "スキル", href: "/skills", frequent: true, group: 'main' },

  { label: "チェーン", href: "/chain", frequent: false, group: 'more' },
  { label: "マンダラチャート", href: "/mandala", frequent: false, group: 'more' },
  { label: "実績", href: "/achievements", frequent: false, group: 'more' },
  { label: "通知", href: "/notifications", frequent: false, group: 'more' },
  { label: "メッセージ", href: "/messages", frequent: false, group: 'more' },
  { label: "アクティビティ", href: "/activity", frequent: false, group: 'more' },
  { label: "チュートリアル", href: "/tutorial", frequent: false, group: 'more' },
  { label: "設定", href: "/settings", frequent: false, group: 'more' },
];

export const footerNav: NavItem[] = [
  { label: 'このサービスについて', href: '/about' },
  { label: '説明 (Help)', href: '/help' },
  { label: 'オアシス宣言', href: '/oasis' },
  { label: 'プライバシー', href: '/privacy' },
  { label: '利用規約', href: '/terms' },
  { label: 'お問い合わせ', href: '/contact' },
];

export default { publicNav, authNav, footerNav };

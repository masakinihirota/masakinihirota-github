export type NavItem = { label: string; href: string };

export const publicNav: NavItem[] = [
  { label: "説明ページ (Help)", href: "/help" },
  { label: "ログイン", href: "/login" },
  { label: "新規会員登録", href: "/register" },
];

export const authNav: NavItem[] = [
  { label: "HOME", href: "/home" },
  { label: "オンボーディング", href: "/onboarding" },
  { label: "チュートリアル", href: "/tutorial" },
];

export default { publicNav, authNav };

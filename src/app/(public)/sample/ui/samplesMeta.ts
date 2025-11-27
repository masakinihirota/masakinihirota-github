export type SampleMeta = {
  slug: string;
  title: string;
  description?: string;
};

export const samples: SampleMeta[] = [
  { slug: '01-landing', title: '01 - ランディングページ (LP)' },
  { slug: '02-login', title: '02 - ログイン画面' },
  { slug: '03-signup', title: '03 - 新規会員登録画面' },
  { slug: '04-onboarding', title: '04 - オンボーディング画面' },
  { slug: '05-home', title: '05 - HOME画面' },
  { slug: '06-root-account', title: '06 - ルートアカウント画面' },
  { slug: '07-user-profile', title: '07 - ユーザープロフィール画面' },
  { slug: '08-work-list', title: '08 - 作品一覧画面' },
  { slug: '09-work-detail', title: '09 - 作品詳細画面' },
  { slug: '10-create-work', title: '10 - 作品登録画面' },
  { slug: '11-organization-list', title: '11 - 組織一覧画面' },
  { slug: '12-country-list', title: '12 - 国一覧画面' },
  { slug: '13-matching-settings', title: '13 - マッチング設定画面' },
  { slug: '14-search', title: '14 - 検索画面' },
  { slug: '15-settings', title: '15 - 設定画面' },
  { slug: '16-oasis-declaration', title: '16 - オアシス宣言ページ' },
  { slug: '17-terms', title: '17 - 利用規約ページ' }
];

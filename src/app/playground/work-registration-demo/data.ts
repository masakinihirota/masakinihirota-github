
export const categories = [
  '書籍',
  '映画',
  'ゲーム',
  '音楽',
  'アート',
  'プロジェクト',
  'その他',
];

export const genresByCategory: Record<string, string[]> = {
  '書籍': ['フィクション', 'ノンフィクション', 'ファンタジー', 'SF', 'ミステリー', 'ビジネス', '技術書'],
  '映画': ['アクション', 'ドラマ', 'SF', 'ホラー', 'コメディ', 'ドキュメンタリー'],
  'ゲーム': ['RPG', 'アクション', 'シミュレーション', 'パズル', 'アドベンチャー'],
  '音楽': ['ポップス', 'ロック', 'ジャズ', 'クラシック', 'ヒップホップ'],
  'アート': ['絵画', '彫刻', 'デジタルアート', '写真'],
  'プロジェクト': ['社会貢献', '技術開発', 'イベント', 'コミュニティ'],
  'その他': ['その他'],
};

export const sizes = [
  { value: 'short', label: 'short (短編)' },
  { value: 'medium', label: 'medium (中編)' },
  { value: 'long', label: 'long (長編)' },
  { value: 'never_ending', label: 'never_ending (連載中)' },
];

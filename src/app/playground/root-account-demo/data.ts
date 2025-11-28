
export const rootAccount = {
  id: 'root-1',
  displayName: 'Taro Yamada',
  location: '日本 (Asia/Tokyo)',
  nativeLanguage: '日本語',
  birthGeneration: '1990年代',
  points: 1000,
  avatarUrl: '/avatars/taro.jpg',
};

export const profiles = [
  {
    id: 'prof-1',
    name: 'Taro (Work)',
    bio: 'ソフトウェアエンジニアとして活動中。',
    purpose: '仕事',
    role: 'リーダー',
    avatarUrl: '/avatars/taro-work.jpg',
  },
  {
    id: 'prof-2',
    name: 'Taro (Hobby)',
    bio: '週末はハイキングに行きます。',
    purpose: '遊び',
    role: 'メンバー',
    avatarUrl: '/avatars/taro-hobby.jpg',
  },
];

export const achievements = [
  {
    id: 'ach-1',
    name: '初陣',
    description: '初めて組織を作成しました',
    awardedAt: '2025-01-15',
    isLocked: false,
  },
  {
    id: 'ach-2',
    name: '人気者',
    description: 'メンバーが10人に達しました',
    awardedAt: '2025-02-10',
    isLocked: false,
  },
  {
    id: 'ach-3',
    name: 'マエストロ',
    description: '作品を10個登録しました',
    awardedAt: null,
    isLocked: true,
  },
];


export const currentUser = {
  id: 'user-1',
  name: '山田 太郎',
  displayName: 'Taro Yamada',
  avatarUrl: '/avatars/taro.jpg', // Dummy URL
  notificationsCount: 5,
};

export const recentActivities = [
  {
    id: 'act-1',
    type: 'matching',
    text: '新しいマッチングが見つかりました',
    count: 3,
    timestamp: '2025-11-28T10:00:00Z',
  },
  {
    id: 'act-2',
    type: 'follow',
    text: '鈴木 花子さんがあなたをフォローしました',
    timestamp: '2025-11-28T09:30:00Z',
  },
  {
    id: 'act-3',
    type: 'clap',
    text: 'あなたの作品「未来の都市」に拍手が送られました',
    count: 5,
    timestamp: '2025-11-27T18:00:00Z',
  },
  {
    id: 'act-4',
    type: 'invite',
    text: '組織「NextGen Creators」に招待されました',
    timestamp: '2025-11-27T15:00:00Z',
  },
];

export const recommendedUsers = [
  {
    id: 'rec-user-1',
    name: '佐藤 健',
    matchRate: 85,
    avatarUrl: '/avatars/ken.jpg',
  },
  {
    id: 'rec-user-2',
    name: '田中 美咲',
    matchRate: 78,
    avatarUrl: '/avatars/misaki.jpg',
  },
  {
    id: 'rec-user-3',
    name: '高橋 誠',
    matchRate: 72,
    avatarUrl: '/avatars/makoto.jpg',
  },
];

export const recommendedWorks = [
  {
    id: 'rec-work-1',
    title: '静寂の森',
    category: '写真',
    thumbnailUrl: '/works/forest.jpg',
  },
  {
    id: 'rec-work-2',
    title: 'AI時代の倫理',
    category: '記事',
    thumbnailUrl: '/works/ai-ethics.jpg',
  },
  {
    id: 'rec-work-3',
    title: 'Blue Ocean',
    category: 'イラスト',
    thumbnailUrl: '/works/blue-ocean.jpg',
  },
];

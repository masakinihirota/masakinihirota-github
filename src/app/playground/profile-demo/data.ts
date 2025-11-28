
export const profile = {
  id: 'prof-1',
  name: 'Taro Yamada',
  bio: 'テクノロジーとアートの融合を目指して活動しています。新しい価値観を探求中。',
  purpose: '仕事',
  role: 'リーダー',
  type: '本人（匿名）',
  avatarUrl: '/avatars/taro.jpg',
  isOwnProfile: true, // Toggle this to test "Follow" button vs "Edit" button
  isFollowing: false,
};

export const works = [
  {
    id: 'work-1',
    title: '未来都市の構想',
    thumbnailUrl: '/works/future-city.jpg',
    tier: 1,
    status: '人生',
    claps: 120,
  },
  {
    id: 'work-2',
    title: '静寂の森',
    thumbnailUrl: '/works/forest.jpg',
    tier: 2,
    status: '今',
    claps: 45,
  },
  {
    id: 'work-3',
    title: 'AI倫理ガイドライン',
    thumbnailUrl: '/works/ai-ethics.jpg',
    tier: 3,
    status: '未来',
    claps: 12,
  },
];

export const values = [
  { id: 'val-1', question: '好きな食べ物', answer: 'ラーメン' },
  { id: 'val-2', question: '趣味', answer: 'ゲーム、読書' },
  { id: 'val-3', question: '大切にしていること', answer: '誠実さ、創造性' },
  { id: 'val-4', question: '将来の夢', answer: '世界中の人と価値観でつながる' },
];

export const skills = [
  { id: 'skill-1', name: 'JavaScript', level: 4, percentage: 80 },
  { id: 'skill-2', name: 'ライティング', level: 3, percentage: 60 },
  { id: 'skill-3', name: 'デザイン', level: 2, percentage: 40 },
];

export const organizations = [
  {
    id: 'org-1',
    name: 'NextGen Creators',
    role: 'リーダー',
    imageUrl: '/orgs/nextgen.jpg',
  },
  {
    id: 'org-2',
    name: 'Local Volunteers',
    role: 'メンバー',
    imageUrl: '/orgs/volunteers.jpg',
  },
];

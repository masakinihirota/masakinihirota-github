
export const organizations = [
  {
    id: 'org-1',
    name: 'NextGen Creators',
    leader: 'Taro Yamada',
    leaderId: 'user-1',
    membersCount: 12,
    maxMembers: 30,
    status: 'active', // active, recruiting, draft, dissolved
    statusLabel: '運営中',
    since: '2024/01',
    description: '次世代のクリエイターが集まり、新しい価値を創造するためのコミュニティです。定期的なハッカソンや勉強会を開催しています。',
  },
  {
    id: 'org-2',
    name: 'Sci-Fi Lovers',
    leader: 'Ken Sato',
    leaderId: 'user-2',
    membersCount: 5,
    maxMembers: 20,
    status: 'recruiting',
    statusLabel: '募集中',
    since: '2024/11',
    description: 'SF作品について語り合う組織です。映画、小説、アニメなど、あらゆるSFジャンルを網羅します。',
  },
  {
    id: 'org-3',
    name: 'Local Volunteers',
    leader: 'Hanako Suzuki',
    leaderId: 'user-3',
    membersCount: 28,
    maxMembers: 50,
    status: 'active',
    statusLabel: '運営中',
    since: '2023/05',
    description: '地域社会への貢献を目指すボランティア団体です。清掃活動やイベントの運営サポートを行っています。',
  },
  {
    id: 'org-4',
    name: 'Game Dev Team',
    leader: 'Game Master',
    leaderId: 'user-4',
    membersCount: 3,
    maxMembers: 5,
    status: 'draft',
    statusLabel: '草案',
    since: '2025/02',
    description: 'インディーゲーム開発のためのチームを結成準備中です。',
  },
  {
    id: 'org-5',
    name: 'Old Book Club',
    leader: 'Librarian',
    leaderId: 'user-5',
    membersCount: 10,
    maxMembers: 10,
    status: 'dissolved',
    statusLabel: '解散済み',
    since: '2020/01',
    description: '古書愛好家の集まりでした。',
  },
];

export const statuses = [
  { value: 'all', label: 'すべて' },
  { value: 'draft', label: '草案' },
  { value: 'recruiting', label: '募集中' },
  { value: 'active', label: '運営中' },
  { value: 'dissolved', label: '解散済み' },
];

export const sortOptions = [
  { value: 'newest', label: '新着順' },
  { value: 'members', label: 'メンバー数順' },
  { value: 'name', label: '組織名順' },
];

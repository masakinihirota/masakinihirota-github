
export const nations = [
  {
    id: 'nation-1',
    name: 'Neo Tokyo',
    level: 'City', // Village, Town, City, Metropolis
    levelLabel: 'City (都市)',
    population: 520,
    maintenanceFee: 100,
    status: 'active', // preparing, active, extinct, reviving
    statusLabel: '運営中',
    since: '2023/05',
    description: '多様な価値観を持つ人々が共生するコミュニティです。テクノロジーと伝統の融合を目指しています。',
  },
  {
    id: 'nation-2',
    name: 'Fantasy Realm',
    level: 'Town',
    levelLabel: 'Town (町)',
    population: 180,
    maintenanceFee: 50,
    status: 'active',
    statusLabel: '運営中',
    since: '2024/02',
    description: 'ファンタジー作品を愛する国です。TRPGや創作活動が盛んです。',
  },
  {
    id: 'nation-3',
    name: 'Green Village',
    level: 'Village',
    levelLabel: 'Village (村)',
    population: 45,
    maintenanceFee: 10,
    status: 'active',
    statusLabel: '運営中',
    since: '2024/08',
    description: '自然との共生をテーマにした村です。農業やエコロジーに関心のある人が集まっています。',
  },
  {
    id: 'nation-4',
    name: 'Cyber Metropolis',
    level: 'Metropolis',
    levelLabel: 'Metropolis (大都市)',
    population: 1200,
    maintenanceFee: 500,
    status: 'reviving',
    statusLabel: '復興中',
    since: '2022/11',
    description: 'かつて栄えたサイバーパンク都市。現在、大規模なシステム改修と共に復興を目指しています。',
  },
  {
    id: 'nation-5',
    name: 'Project X',
    level: 'Village',
    levelLabel: 'Village (村)',
    population: 5,
    maintenanceFee: 0,
    status: 'preparing',
    statusLabel: '準備中',
    since: '2025/03',
    description: '極秘プロジェクトの準備段階です。',
  },
];

export const levels = [
  { value: 'all', label: 'すべて' },
  { value: 'Village', label: 'Village (村)' },
  { value: 'Town', label: 'Town (町)' },
  { value: 'City', label: 'City (都市)' },
  { value: 'Metropolis', label: 'Metropolis (大都市)' },
];

export const sortOptions = [
  { value: 'newest', label: '新着順' },
  { value: 'population', label: '人口数順' },
  { value: 'level', label: 'レベル順' },
  { value: 'name', label: '国名順' },
];

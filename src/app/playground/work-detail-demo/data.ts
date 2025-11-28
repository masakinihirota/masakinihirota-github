
export const works = [
  {
    id: 'work-1',
    title: '静寂の森',
    authors: ['Taro Yamada'],
    category: '写真',
    genres: ['自然', '風景'],
    year: 2024,
    size: 'medium',
    claps: 120,
    thumbnailUrl: '/works/forest.jpg',
    description: '静寂に包まれた深い森の風景を切り取った写真集です。四季折々の表情を見せる森の姿を通じて、自然の美しさと厳しさを表現しています。特に、朝霧に煙る杉林の写真は、見る人を幻想的な世界へと誘います。\n\nこの作品は、3年間の撮影期間を経て完成しました。撮影地は日本の屋久島、白神山地など、世界遺産にも登録されている美しい森たちです。',
    introUrl: 'https://example.com/forest',
    affiliateUrl: 'https://example.com/buy/forest',
    isOwner: true,
  },
  {
    id: 'work-2',
    title: '未来都市の構想',
    authors: ['Ken Sato', 'AI Architect'],
    category: 'デザイン',
    genres: ['SF', '都市計画'],
    year: 2025,
    size: 'long',
    claps: 85,
    thumbnailUrl: '/works/future.jpg',
    description: '2050年の東京をイメージした都市デザインのコンセプトアート集。持続可能なエネルギーシステムと、自然と共生する建築物が特徴です。',
    introUrl: 'https://example.com/future',
    affiliateUrl: null,
    isOwner: false,
  },
  // Add more dummy works as needed to match IDs from works-demo if possible
];

export const relatedWorks = [
  {
    id: 'work-2',
    title: '未来都市の構想',
    author: 'Ken Sato',
    thumbnailUrl: '/works/future.jpg',
  },
  {
    id: 'work-3',
    title: 'AI倫理ガイドライン',
    author: 'Hanako Suzuki',
    thumbnailUrl: '/works/ai.jpg',
  },
  {
    id: 'work-4',
    title: '春の訪れ',
    author: 'Taro Yamada',
    thumbnailUrl: '/works/spring.jpg',
  },
];

export function getWorkById(id: string) {
  return works.find((w) => w.id === id) || works[0]; // Fallback to first work if not found
}

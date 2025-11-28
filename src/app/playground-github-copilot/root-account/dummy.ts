export const rootAccountDummy = {
  root: {
    id: 'ra_001',
    display_name: '山田 花子',
    icon: '/images/default-avatar.png',
    location: 'Japan - Kansai',
    native_language: '日本語',
    points: 3400,
  },
  profiles: [
    { id: 'rp1', name: '花子（仕事）', icon: '/images/user-2.png', purpose: '仕事', role: 'リーダー' },
    { id: 'rp2', name: '花子（遊び）', icon: '/images/user-3.png', purpose: '遊び', role: 'メンバー' },
  ],
  transactions: [
    { id: 't1', title: '報酬: 作品拍手', amount: 150 },
    { id: 't2', title: '支出: 組織維持費', amount: -50 },
  ],
}


export const userSettings = {
  account: {
    email: 'user@example.com',
    displayName: 'ユーザーA',
    language: 'ja',
    timezone: 'Asia/Tokyo',
  },
  privacy: {
    profilePublic: true,
    worksPublic: true,
    valuesPublic: false,
    skillsPublic: true,
  },
  security: {
    twoFactorEnabled: false,
  },
  connections: {
    google: true,
    github: false,
  },
  payment: {
    plan: '無料プラン',
    cardLast4: '1234',
  },
};

export const languages = [
  { value: 'ja', label: '日本語' },
  { value: 'en', label: 'English' },
];

export const timezones = [
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York' },
];

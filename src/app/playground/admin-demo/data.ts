
export const stats = {
  totalUsers: 12543,
  activeUsers: 8432,
  newUsersToday: 124,
  pendingReports: 15,
  totalWorks: 4521,
  totalNations: 32,
};

export const users = [
  { id: 'u1', name: 'Taro Yamada', email: 'taro@example.com', role: 'user', status: 'active', joinedAt: '2023-01-15' },
  { id: 'u2', name: 'Hanako Suzuki', email: 'hanako@example.com', role: 'admin', status: 'active', joinedAt: '2023-02-20' },
  { id: 'u3', name: 'Bad User', email: 'bad@example.com', role: 'user', status: 'suspended', joinedAt: '2023-05-10' },
  { id: 'u4', name: 'Newbie', email: 'new@example.com', role: 'user', status: 'active', joinedAt: '2023-11-28' },
  { id: 'u5', name: 'Spammer', email: 'spam@example.com', role: 'user', status: 'banned', joinedAt: '2023-06-01' },
];

export const contents = [
  { id: 'c1', title: 'Future City Concept', author: 'Taro Yamada', type: 'work', status: 'published', createdAt: '2023-10-01', reports: 0 },
  { id: 'c2', title: 'Inappropriate Post', author: 'Bad User', type: 'comment', status: 'flagged', createdAt: '2023-11-25', reports: 5 },
  { id: 'c3', title: 'Beautiful Landscape', author: 'Hanako Suzuki', type: 'work', status: 'published', createdAt: '2023-11-20', reports: 0 },
  { id: 'c4', title: 'Spam Message', author: 'Spammer', type: 'message', status: 'removed', createdAt: '2023-11-28', reports: 12 },
];

export const penalties = [
  { id: 'p1', userId: 'u3', userName: 'Bad User', type: 'suspension', reason: 'Harassment', duration: '7 days', issuedAt: '2023-11-26', status: 'active' },
  { id: 'p2', userId: 'u5', userName: 'Spammer', type: 'ban', reason: 'Spamming', duration: 'Permanent', issuedAt: '2023-11-28', status: 'active' },
  { id: 'p3', userId: 'u1', userName: 'Taro Yamada', type: 'warning', reason: 'Minor guideline violation', duration: 'N/A', issuedAt: '2023-09-15', status: 'expired' },
];

export const systemLogs = [
  { id: 'l1', level: 'info', message: 'System backup completed', timestamp: '2023-11-29 04:00:00' },
  { id: 'l2', level: 'warning', message: 'High CPU usage detected', timestamp: '2023-11-29 14:30:00' },
  { id: 'l3', level: 'error', message: 'Database connection timeout', timestamp: '2023-11-28 23:15:00' },
  { id: 'l4', level: 'info', message: 'New deployment successful', timestamp: '2023-11-28 10:00:00' },
];

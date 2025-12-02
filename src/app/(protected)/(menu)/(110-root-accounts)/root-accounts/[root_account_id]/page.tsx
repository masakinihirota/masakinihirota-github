/**
 * ルートアカウント詳細ページ
 */
import { RootAccountDashboard } from "./components";

// Mock データ取得関数（将来的にはDBから取得）
async function getRootAccountData(rootAccountId: string) {
  // 仮のデータ
  return {
    rootAccount: {
      id: rootAccountId,
      displayName: "山田太郎",
      location: "東京都",
      language: "日本語",
      generation: "1990年代",
      points: 1500,
    },
    profiles: [
      {
        id: "profile-1",
        name: "ビジネスプロフィール",
        purpose: "仕事",
        avatarUrl: "/avatar1.png",
      },
      {
        id: "profile-2",
        name: "趣味プロフィール",
        purpose: "遊び",
        avatarUrl: "/avatar2.png",
      },
    ],
    achievements: [
      { id: "ach-1", name: "初陣", description: "初組織作成", unlocked: true },
      {
        id: "ach-2",
        name: "人気者",
        description: "メンバー10人達成",
        unlocked: true,
      },
      {
        id: "ach-3",
        name: "大国建設者",
        description: "国を建国する",
        unlocked: false,
      },
    ],
  };
}

interface PageProps {
  params: Promise<{ root_account_id: string }>;
}

export default async function RootAccountDetailPage({ params }: PageProps) {
  const { root_account_id } = await params;
  const data = await getRootAccountData(root_account_id);

  return (
    <RootAccountDashboard
      rootAccount={data.rootAccount}
      profiles={data.profiles}
      achievements={data.achievements}
    />
  );
}

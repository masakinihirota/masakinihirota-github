import { notFound } from "next/navigation";
import * as profileComponents from "../components";

// モックデータ（後でAPI/DBから取得する）
const mockProfilesData: Record<string, profileComponents.ProfileDetailData> = {
  "1": {
    id: "1",
    displayName: "田中太郎",
    avatarUrl: "/avatars/tanaka.jpg",
    bio: "クリエイティブなデザイナーです。価値観を大切にしています。",
    purpose: "仕事",
    role: "リーダー",
    type: "本人（匿名）",
    isOwner: true,
    works: [
      {
        id: "w1",
        title: "デザインプロジェクトA",
        tier: 1,
        status: "人生",
        claps: 15,
      },
      {
        id: "w2",
        title: "UIデザイン作品集",
        tier: 2,
        status: "今",
        claps: 8,
      },
    ],
    values: [
      { id: "v1", question: "好きな食べ物", answer: "ラーメン" },
      { id: "v2", question: "趣味", answer: "ゲーム、読書" },
      { id: "v3", question: "大切にしていること", answer: "誠実さ、創造性" },
    ],
    skills: [
      { id: "s1", name: "JavaScript", level: 4, percentage: 80 },
      { id: "s2", name: "ライティング", level: 3, percentage: 60 },
      { id: "s3", name: "デザイン", level: 2, percentage: 40 },
    ],
    organizations: [
      { id: "o1", name: "クリエイティブ組織A", role: "リーダー" },
    ],
  },
  "2": {
    id: "2",
    displayName: "佐藤花子",
    bio: "フロントエンドエンジニアです。",
    purpose: "仕事",
    role: "メンバー",
    type: "本人（実名）",
    isOwner: false,
    skills: [
      { id: "s1", name: "TypeScript", level: 5, percentage: 100 },
      { id: "s2", name: "React", level: 4, percentage: 80 },
    ],
    organizations: [
      { id: "o2", name: "テック国B", role: "メンバー" },
    ],
  },
};

type PageProps = {
  params: Promise<{ profile_id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { profile_id } = await params;
  const profile = mockProfilesData[profile_id];

  if (!profile) {
    return { title: "プロフィールが見つかりません — masakinihirota" };
  }

  return {
    title: `${profile.displayName} — masakinihirota`,
    description: profile.bio,
  };
}

export default async function ProfileDetailPage({ params }: PageProps) {
  const { profile_id } = await params;
  const profile = mockProfilesData[profile_id];

  if (!profile) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6">
      <profileComponents.ProfileDetail profile={profile} />
    </div>
  );
}

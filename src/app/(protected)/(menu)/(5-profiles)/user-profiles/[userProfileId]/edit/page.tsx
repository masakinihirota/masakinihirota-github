/**
 * プロフィール編集ページ
 *
 * @route /profiles/[profile_id]/edit
 * @description ユーザープロフィールを編集するページ
 */

import { ProfileEditForm } from "./components";

interface PageProps {
  params: Promise<{ profile_id: string }>;
}

// モックデータ（実際にはDBから取得）
const getMockProfile = (id: string) => ({
  id,
  displayName: "テストユーザー",
  username: "test_user",
  bio: "これはテスト用のプロフィールです。",
  role: "member",
  purpose: "work",
  type: "self",
});

export default async function ProfileEditPage({ params }: PageProps) {
  const { profile_id } = await params;
  const profile = getMockProfile(profile_id);

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <ProfileEditForm profile={profile} />
    </div>
  );
}

/**
 * ルートアカウント設定ページ
 */
import { RootAccountSettings } from "./components";

// Mock データ取得関数（将来的にはDBから取得）
async function getRootAccountData(rootAccountId: string) {
  return {
    id: rootAccountId,
    displayName: "山田太郎",
    email: "yamada@example.com",
    lastRestartAt: "2025-01-01T00:00:00Z",
  };
}

interface PageProps {
  params: Promise<{ root_account_id: string }>;
}

export default async function RootAccountSettingsPage({ params }: PageProps) {
  const { root_account_id } = await params;
  const rootAccount = await getRootAccountData(root_account_id);

  return <RootAccountSettings rootAccount={rootAccount} />;
}

import { RootAccountsDashboard } from "@/components/root-accounts"

/**
 * /root-accounts ルート
 * UIは `RootAccountsDashboard` に委譲。将来ここでデータフェッチ (Server Component) を行い props 渡しへ移行予定。
 */
export default function RootAccountsPage() {
    return <RootAccountsDashboard />
}

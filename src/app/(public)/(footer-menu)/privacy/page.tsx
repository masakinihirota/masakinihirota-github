import Link from 'next/link'

export const metadata = { title: 'プライバシーポリシー — masakinihirota' }

export default function PrivacyPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">プライバシーポリシー</h1>
            <p className="mb-4">このサービスの個人情報の取り扱いについての説明ページ（静的プレースホルダ）。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    )
}

import Link from 'next/link'

export const metadata = { title: '利用規約 — masakinihirota' }

export default function TermsPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">利用規約</h1>
            <p className="mb-4">サービス利用に関する規約のプレースホルダ。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    )
}

import Link from 'next/link'

export const metadata = { title: 'お問い合わせ — masakinihirota' }

export default function ContactPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">お問い合わせ</h1>
            <p className="mb-4">お問い合わせ・サポート窓口のプレースホルダページ。</p>
            <nav className="mt-6">
                <Link href="/">トップへ戻る</Link>
            </nav>
        </div>
    )
}

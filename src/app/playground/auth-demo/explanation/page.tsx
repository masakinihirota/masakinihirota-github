
import Link from 'next/link';
import { Search, BookOpen, HelpCircle, Shield, Info, ChevronRight } from 'lucide-react';

export default function AuthExplanationPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-blue-600 py-16 text-center text-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">VNS ヘルプセンター</h1>
                    <p className="text-xl text-blue-100 mb-8">どのようなお手伝いが必要ですか？</p>
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="キーワードで検索（例: アカウント作成、組織、ポイント）"
                            className="w-full px-6 py-4 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400"
                        />
                        <Search className="absolute right-6 top-4 h-6 w-6 text-gray-400" />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-16">
                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {[
                        { title: '初めての方へ', icon: BookOpen, desc: 'VNSの基本的な使い方とコンセプト' },
                        { title: '機能紹介', icon: Info, desc: '作品登録、価値観マッチングなどの詳細' },
                        { title: 'よくある質問', icon: HelpCircle, desc: '困ったときの解決方法' },
                        { title: '安心・安全', icon: Shield, desc: 'プライバシーとセキュリティについて' },
                    ].map((cat) => (
                        <div key={cat.title} className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                                <cat.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.title}</h3>
                            <p className="text-gray-600 text-sm">{cat.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Popular Articles */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">よく読まれている記事</h2>
                    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                        {[
                            'アカウントを作成するには？',
                            '「価値観」とは何ですか？',
                            '組織に参加する方法',
                            'ポイント（pt）の貯め方と使い方',
                            '退会したい場合の手続き',
                        ].map((article) => (
                            <a key={article} href="#" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
                                <span className="text-gray-700 font-medium group-hover:text-blue-600">{article}</span>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-blue-50 rounded-2xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">解決しない場合</h2>
                    <p className="text-gray-600 mb-6">サポートチームが直接お問い合わせにお答えします。</p>
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm">
                        お問い合わせフォームへ
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 text-center">
                <div className="max-w-4xl mx-auto px-4 space-y-4">
                    <div className="flex justify-center space-x-8 text-sm">
                        <Link href="/playground/terms-demo" className="hover:text-white">利用規約</Link>
                        <Link href="/playground/privacy-demo" className="hover:text-white">プライバシーポリシー</Link>
                        <Link href="#" className="hover:text-white">特定商取引法に基づく表記</Link>
                    </div>
                    <p className="text-xs">&copy; 2025 VNS Project. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

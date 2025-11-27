"use client";
import React from 'react';
import { BookOpen, Users, MessageSquare, Shield, TrendingUp, Handshake } from 'lucide-react';

// アイコンとコンテンツを定義するためのデータ構造
const declarationSections = [
    {
        icon: Users,
        title: '多様性の尊重',
        subtitle: '第1条',
        content: [
            '異なる価値観を持つ人々を尊重し、排除しない。',
            '文化的背景の違いを認め、偏見を持たない。',
            '多様な意見を歓迎し、対話を通じて理解を深める。',
        ],
        color: 'text-emerald-600',
    },
    {
        icon: MessageSquare,
        title: '対話の促進',
        subtitle: '第2条',
        content: [
            '作品を通じた文化交流を積極的に行う。',
            '建設的な対話を心がけ、攻撃的な言動を避ける。',
            '異なる意見に対しても敬意を払い、理解を試みる。',
        ],
        color: 'text-sky-600',
    },
    {
        icon: Shield,
        title: '誠実な行動',
        subtitle: '第3条',
        content: [
            '正直に自分の価値観や意見を表明する。',
            '虚偽の情報を広めず、事実に基づいた発言をする。',
            '他者を欺かず、信頼関係を大切にする。',
        ],
        color: 'text-indigo-600',
    },
    {
        icon: TrendingUp,
        title: '成長と学び',
        subtitle: '第4条',
        content: [
            '新しい作品や価値観に触れ、自己成長を目指す。',
            '他者から学び、自分の視野を広げる。',
            '失敗を恐れず、挑戦し続ける。',
        ],
        color: 'text-amber-600',
    },
    {
        icon: Handshake,
        title: 'コミュニティへの貢献',
        subtitle: '第5条',
        content: [
            '作品の紹介や評価を通じて、文化の発展に貢献する。',
            '他のメンバーを支援し、協力する。',
            'コミュニティのルールを守り、健全な環境を維持する。',
        ],
        color: 'text-rose-600',
    },
];

// ヘッダーコンポーネントのモック
const Header = () => (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-md z-10">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-teal-600">VNS</div>
            <nav>
                <a href="/" className="text-gray-600 hover:text-teal-600 transition duration-150">HOME</a>
                {/* 認証前の簡易ヘッダーを想定し、ここではログイン/登録ボタンは省略 */}
            </nav>
        </div>
    </header>
);

// フッターコンポーネントのモック
const Footer = () => (
    <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto p-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} VNS Community. All rights reserved.</p>
        </div>
    </footer>
);

// 宣言の各条文セクションのコンポーネント
const DeclarationSection = ({ icon: Icon, title, subtitle, content, color }) => (
    <section className="mb-12 border-l-4 border-gray-200 pl-6 pt-2" aria-labelledby={`section-${subtitle}`}>
        {/* 見出しエリア */}
        <div className="flex items-center mb-4">
            <Icon className={`w-8 h-8 mr-3 ${color} flex-shrink-0`} aria-hidden="true" />
            <h2 id={`section-${subtitle}`} className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${color}`}>
                【{subtitle}】{title}
            </h2>
        </div>

        {/* 内容 */}
        <ul className="list-none space-y-3 pl-0 text-lg text-gray-700 leading-relaxed">
            {content.map((item, index) => (
                <li key={index} className="flex">
                    {/* アクセシビリティと可読性のためにリスト形式で表示 */}
                    <span className="font-semibold text-gray-500 w-6 flex-shrink-0">{index + 1}.</span>
                    <p className="flex-1">{item}</p>
                </li>
            ))}
        </ul>
    </section>
);


const App = () => {
    // ナビゲーションをシミュレートするハンドラ
    const handleRegisterClick = () => {
        // 実際の実装では Next.js の useRouter などで /register へ遷移
        console.log('新規会員登録画面（/register）へ遷移します。');
        // window.location.href = '/register';
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800">
            <Header />

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* タイトルエリア */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-teal-700 mb-2 tracking-tight">
                            オアシス宣言
                        </h1>
                        <p className="text-lg lg:text-xl text-teal-500 font-medium tracking-wider">
                            Oasis Declaration
                        </p>
                    </div>

                    {/* 前文 */}
                    <section className="mb-16 p-8 bg-white shadow-xl rounded-2xl border-t-8 border-teal-500">
                        <div className="flex items-center mb-4">
                            <BookOpen className="w-8 h-8 mr-3 text-teal-600 flex-shrink-0" aria-hidden="true" />
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-teal-700 tracking-tight">
                                【前文】
                            </h2>
                        </div>
                        <p className="text-lg text-gray-700 leading-9 whitespace-pre-line">
                            私たちは、多様な価値観を尊重し、互いに理解し合う
                            ことを目指すオンラインコミュニティを作ります。
                            作品を通じた文化交流と対話を促進し、個人の成長と
                            社会の発展に貢献することを目的とします。
                        </p>
                    </section>

                    {/* 各条文（第1条〜第5条） */}
                    <div className="bg-white p-8 lg:p-12 shadow-xl rounded-2xl space-y-16">
                        {declarationSections.map((section, index) => (
                            <DeclarationSection
                                key={index}
                                icon={section.icon}
                                title={section.title}
                                subtitle={section.subtitle}
                                content={section.content}
                                color={section.color}
                            />
                        ))}
                    </div>

                    {/* 結び */}
                    <section className="mt-16 text-center p-8 bg-gray-100 rounded-xl shadow-inner">
                        <h2 className="text-2xl font-bold text-gray-700 mb-4">
                            【結び】
                        </h2>
                        <p className="text-xl font-semibold text-gray-800 leading-9">
                            この宣言に賛同し、実践することで、私たちは
                            より豊かで多様性に満ちたコミュニティを築きます。
                            <br className="sm:hidden" />
                            オアシスのように、誰もが安心して集い、
                            交流できる場所を目指します。
                        </p>
                    </section>

                    {/* ボタンエリア */}
                    <div className="mt-16 text-center">
                        <button
                            onClick={handleRegisterClick}
                            className="w-full sm:w-auto px-12 py-4 bg-teal-600 text-white font-bold text-xl rounded-full shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
                            aria-label="同意して新規会員登録へ進む"
                        >
                            同意して登録へ進む
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default App;

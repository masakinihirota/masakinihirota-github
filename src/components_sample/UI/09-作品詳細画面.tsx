"use client";
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import { Share2, Edit, Trash2, ChevronLeft, ThumbsUp, Link, ShoppingCart, Info, X } from 'lucide-react';

// --- モックデータ定義 ---

// Work Size Enum (参考スキーマ)
const WorkSize = {
    SHORT: 'short',
    MEDIUM: 'medium',
    LONG: 'long',
    NEVER_ENDING: 'never_ending',
};

// 関連作品のモックデータ
const mockRelatedWorks = [
    { id: 'chain-1', title: '作品A: 序章', author: '著者A', imageUrl: 'https://placehold.co/100x120/a8dadc/1d3557?text=Work+A' },
    { id: 'chain-2', title: '作品B: 発展', author: '著者A', imageUrl: 'https://placehold.co/100x120/457b9d/f1faee?text=Work+B' },
    { id: 'chain-3', title: '作品C: 完結', author: '著者B', imageUrl: 'https://placehold.co/100x120/1d3557/a8dadc?text=Work+C' },
    { id: 'chain-4', title: '作品D: スピンオフ', author: '著者A', imageUrl: 'https://placehold.co/100x120/e63946/f1faee?text=Work+D' },
];

// メイン作品のモックデータ
const mockWorkDetail = {
    id: 'work-1',
    title: 'ハイブリッド・テクノロジー時代の羅針盤',
    category: '書籍',
    description: 'この作品は、AIとブロックチェーン技術が融合した近未来の世界を舞台に、一人のエンジニアが巨大な中央集権システムに立ち向かう壮大な物語です。技術的な詳細と倫理的な問いかけが深く織り交ぜられており、読者を没入させます。\n\n**主な登場人物:**\n* アカリ: 若きエンジニア。Drizzle ORMの熱狂的なファン。\n* ゼウス: 支配的なAIシステム。\n\n**ポイント:**\n1.  **Next.js 15の未来**: React Server Componentsの可能性を追及。\n2.  **Honoによる高速API**: エッジでのデータ処理の重要性。\n3.  **Supabase Authの役割**: 分散化された認証システムの必要性。',
    authors: ['著者A (Taro)', '著者B (Jiro)'],
    release_year: 2024,
    genres: ['フィクション', '技術', 'SF', '哲学'],
    intro_url: 'https://vercel.com/home',
    affiliate_url: 'https://supabase.com/',
    size: WorkSize.LONG,
    imageUrl: 'https://placehold.co/400x300/2a9d8f/f1faee?text=Work+Cover+Image',
    claps: 10,
    is_created_by_current_user: true, // 作成者権限のモック
    related_works: mockRelatedWorks,
};

// --- ヘルパー関数 ---

// 拍手数をフォーマット（例: 1000 -> 1.0K）
const formatClapCount = (count) => {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count;
};

// --- Reducer / State Management ---

const initialState = {
    work: mockWorkDetail,
    isModalOpen: false,
    isClapping: false,
    isDescriptionExpanded: false,
};

function workReducer(state, action) {
    switch (action.type) {
        case 'TOGGLE_MODAL':
            return { ...state, isModalOpen: !state.isModalOpen };
        case 'TOGGLE_DESCRIPTION':
            return { ...state, isDescriptionExpanded: !state.isDescriptionExpanded };
        case 'START_CLAP':
            return { ...state, isClapping: true };
        case 'STOP_CLAP':
            return { ...state, isClapping: false };
        case 'CLAP_SUCCESS':
            return { ...state, work: { ...state.work, claps: state.work.claps + 1 }, isClapping: false };
        case 'FETCH_WORK_SUCCESS':
            // 実際のデータ取得時に使用
            return { ...state, work: action.payload };
        case 'WORK_NOT_FOUND':
            return { ...state, work: null };
        default:
            return state;
    }
}

// --- Component: WorkDetail (作品詳細画面) ---

const WorkDetail = () => {
    const [state, dispatch] = useReducer(workReducer, initialState);
    const { work, isModalOpen, isClapping, isDescriptionExpanded } = state;

    // 実際の実装では、work_idをURLパラメータから取得し、fetch処理を行う
    // const workId = 'work-1';

    // モック: 作品が存在しないケース
    // useEffect(() => {
    //   // 実際のAPIコールロジック
    //   // if (fetchError === 404) dispatch({ type: 'WORK_NOT_FOUND' });
    // }, []);

    // 拍手アクションのハンドラー
    const handleClap = useCallback(() => {
        if (isClapping) return; // 連続クリック防止

        dispatch({ type: 'START_CLAP' });

        // 実際にはHono/Drizzle APIへのPOSTリクエストを行う
        console.log('API: Clapping for work:', work.id);

        // 拍手処理のモック (1秒後に成功)
        setTimeout(() => {
            // ユーザーの1日1回制限チェックはサーバー側で行う
            dispatch({ type: 'CLAP_SUCCESS' });
            console.log('Clap successful!');
        }, 1000);
    }, [isClapping, work]);

    // 削除アクションのハンドラー
    const handleDelete = useCallback(() => {
        // 実際にはHono/Drizzle APIへのDELETEリクエストを行う
        console.log('API: Deleting work:', work.id);

        // 削除処理のモック (2秒後に成功し、一覧へ遷移)
        setTimeout(() => {
            console.log('Work deleted. Redirecting to /works');
            // window.location.href = '/works'; // 実際にはNext.jsのrouterを使用
        }, 2000);
        dispatch({ type: 'TOGGLE_MODAL' });
    }, [work]);

    // 作品が見つからない場合のエラー表示
    if (work === null) {
        return <WorkNotFound workId={'work-1'} />;
    }

    // 説明文の表示制限（長文の場合の折りたたみ）
    const maxDescriptionLength = 300;
    const isTooLong = work.description.length > maxDescriptionLength;
    const descriptionText = isDescriptionExpanded || !isTooLong
        ? work.description
        : work.description.substring(0, maxDescriptionLength) + '...';

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <div className="flex container mx-auto p-4 md:p-8">
                <Sidebar />
                <main className="flex-1 lg:ml-64 p-2 md:p-6 bg-white rounded-xl shadow-lg">
                    {/* ナビゲーション */}
                    <div className="mb-6">
                        <button
                            onClick={() => console.log('Navigate to /works')}
                            className="flex items-center text-blue-600 hover:text-blue-800 transition duration-150"
                        >
                            <ChevronLeft className="w-5 h-5 mr-1" />
                            <span className="text-base font-medium">一覧へ戻る</span>
                        </button>
                    </div>

                    {/* 作品メイン情報 */}
                    <section className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-200">
                        <WorkImage url={work.imageUrl} />
                        <WorkDetails work={work} dispatch={dispatch} />
                    </section>

                    {/* 作品説明 */}
                    <section className="py-8 border-b border-gray-200">
                        <SectionTitle title="作品説明" icon={Info} />
                        <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                            {descriptionText.split('\n').map((line, index) => (
                                // Markdownの代わりに簡易的な改行処理
                                <p key={index} className="mb-2">{line}</p>
                            ))}
                        </div>
                        {isTooLong && (
                            <button
                                onClick={() => dispatch({ type: 'TOGGLE_DESCRIPTION' })}
                                className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                                {isDescriptionExpanded ? '折りたたむ' : 'もっと読む'}
                            </button>
                        )}
                    </section>

                    {/* 関連リンク */}
                    <section className="py-8 border-b border-gray-200">
                        <SectionTitle title="関連リンク" icon={Link} />
                        <LinkList introUrl={work.intro_url} affiliateUrl={work.affiliate_url} />
                    </section>

                    {/* 関連作品チェーン */}
                    <section className="py-8">
                        <SectionTitle title="関連作品チェーン" icon={Share2} />
                        <WorkChain works={work.related_works} />
                    </section>
                </main>
            </div>
            {isModalOpen && <DeleteConfirmationModal workTitle={work.title} dispatch={dispatch} handleDelete={handleDelete} />}
            <Footer />
        </div>
    );
};

// --- Sub Components ---

const Header = () => (
    <header className="sticky top-0 z-10 bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-black text-indigo-700">Work Chain Hub</h1>
            <button className="text-gray-600 md:hidden p-2 rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
            </button>
            <div className="hidden md:block">
                <span className="text-sm text-gray-500">ユーザーID: {mockWorkDetail.id}</span>
            </div>
        </div>
    </header>
);

const Sidebar = () => (
    <nav className="hidden lg:block fixed w-60 h-full bg-gray-800 p-4 rounded-lg text-white shadow-xl">
        <div className="text-lg font-bold mb-8">ナビゲーション</div>
        <ul className="space-y-2">
            <li className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition">
                <span className="font-medium">🏠 HOME</span>
            </li>
            <li className="p-3 bg-indigo-600 rounded-lg cursor-default">
                <span className="font-bold">📚 作品 (現在地)</span>
            </li>
            <li className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition">
                <span className="font-medium">👤 プロフィール</span>
            </li>
        </ul>
    </nav>
);

const Footer = () => (
    <footer className="bg-gray-800 text-white p-4 text-center mt-12">
        <p className="text-sm">© 2024 Work Chain System</p>
    </footer>
);

const WorkImage = ({ url }) => (
    <div className="flex-shrink-0 w-full md:w-96 flex justify-center md:justify-start">
        <div className="shadow-2xl rounded-xl overflow-hidden transform hover:scale-[1.02] transition duration-300">
            <img
                src={url}
                alt="作品のカバー画像"
                className="object-cover w-full h-auto max-h-96"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x300/666/fff?text=No+Image" }}
            />
        </div>
    </div>
);

const WorkDetails = ({ work, dispatch }) => (
    <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            {work.title}
        </h2>

        <dl className="space-y-2 text-base text-gray-600 mb-6">
            <div><dt className="inline font-semibold">著者:</dt> <dd className="inline">{work.authors.join(', ')}</dd></div>
            <div><dt className="inline font-semibold">カテゴリ:</dt> <dd className="inline"><Pill text={work.category} /></dd></div>
            <div><dt className="inline font-semibold">ジャンル:</dt> <dd className="inline">{work.genres.map(g => <Pill key={g} text={g} />)}</dd></div>
            <div><dt className="inline font-semibold">発売年:</dt> <dd className="inline">{work.release_year}年</dd></div>
            <div><dt className="inline font-semibold">サイズ:</dt> <dd className="inline"><Pill text={work.size} color="bg-yellow-100 text-yellow-800" /></dd></div>
        </dl>

        {/* 拍手ボタン */}
        <button
            onClick={() => dispatch({ type: 'CLAP_SUCCESS' })} // モックでは無制限
            className={`flex items-center justify-center px-6 py-3 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg ${work.claps % 2 === 0 ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-white border-2 border-orange-500 text-orange-500 hover:bg-orange-50'
                }`}
        >
            <ThumbsUp className="w-6 h-6 mr-2" />
            👏 拍手する ({formatClapCount(work.claps)})
        </button>
        <p className="text-xs text-gray-500 mt-2">※ 1日1回まで</p>

        {/* 編集・削除ボタン (作成者のみ) */}
        {work.is_created_by_current_user && (
            <div className="mt-6 flex space-x-4">
                <button
                    onClick={() => console.log('Navigate to /works/' + work.id + '/edit')}
                    className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 p-2 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition"
                >
                    <Edit className="w-4 h-4 mr-1" />
                    編集
                </button>
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_MODAL' })}
                    className="flex items-center text-sm font-semibold text-red-600 hover:text-red-800 p-2 rounded-lg border border-red-600 hover:bg-red-50 transition"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    削除
                </button>
            </div>
        )}
    </div>
);

const Pill = ({ text, color = 'bg-indigo-100 text-indigo-800' }) => (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium mr-2 my-1 ${color}`}>
        {text}
    </span>
);

const SectionTitle = ({ title, icon: Icon }) => (
    <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2 flex items-center">
        <Icon className="w-6 h-6 mr-2 text-indigo-500" />
        【{title}】
    </h3>
);

const LinkList = ({ introUrl, affiliateUrl }) => (
    <div className="space-y-4">
        <a href={introUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition duration-150">
            <Link className="w-5 h-5 mr-3 text-indigo-500" />
            <span className="font-medium">紹介URL:</span> <span className="ml-2 truncate">{introUrl}</span>
        </a>
        <a href={affiliateUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 hover:underline transition duration-150">
            <ShoppingCart className="w-5 h-5 mr-3 text-red-500" />
            <span className="font-medium">🛒 アフィリエイトURL:</span> <span className="ml-2 truncate">{affiliateUrl}</span>
        </a>
    </div>
);

const WorkChain = ({ works }) => (
    <div className="overflow-x-auto pb-4">
        <p className="text-gray-600 mb-4 text-sm">この作品から派生した作品、または繋がりのある作品:</p>
        <div className="flex items-center space-x-4">
            {works.map((work, index) => (
                <React.Fragment key={work.id}>
                    <WorkChainCard work={work} />
                    {index < works.length - 1 && (
                        <span className="text-gray-400 text-3xl font-light transform -translate-y-2">→</span>
                    )}
                </React.Fragment>
            ))}
        </div>
    </div>
);

const WorkChainCard = ({ work }) => (
    <div
        onClick={() => console.log('Navigate to /works/' + work.id)}
        className="flex-shrink-0 w-40 p-3 bg-white border border-gray-200 rounded-xl shadow-md cursor-pointer transition duration-300 hover:shadow-xl hover:scale-[1.03] text-center"
    >
        <div className="w-full h-32 mb-2 overflow-hidden rounded-lg">
            <img
                src={work.imageUrl}
                alt={work.title}
                className="object-cover w-full h-full"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x120/94a3b8/fff?text=No+Image" }}
            />
        </div>
        <p className="text-sm font-semibold text-gray-900 truncate" title={work.title}>{work.title}</p>
        <p className="text-xs text-gray-500 truncate">{work.author}</p>
    </div>
);

const DeleteConfirmationModal = ({ workTitle, dispatch, handleDelete }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all">
            <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold text-red-600">削除の確認</h4>
                <button onClick={() => dispatch({ type: 'TOGGLE_MODAL' })} className="text-gray-400 hover:text-gray-600 transition">
                    <X className="w-6 h-6" />
                </button>
            </div>
            <p className="text-gray-700 mb-6">
                作品 **"{workTitle}"** を本当に削除しますか？この操作は元に戻せません。
            </p>
            <div className="flex justify-end space-x-3">
                <button
                    onClick={() => dispatch({ type: 'TOGGLE_MODAL' })}
                    className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                    キャンセル
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-md"
                >
                    削除する
                </button>
            </div>
        </div>
    </div>
);

const WorkNotFound = ({ workId }) => (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col items-center justify-center p-8">
        <h2 className="text-4xl font-bold text-red-500 mb-4">404 - Not Found</h2>
        <p className="text-lg text-gray-600 mb-6">
            ID: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{workId}</span> の作品は見つかりませんでした。
        </p>
        <button
            onClick={() => console.log('Navigate to /works')}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
        >
            作品一覧へ戻る
        </button>
    </div>
);

export default WorkDetail;

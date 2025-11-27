"use client";

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User } from 'supabase/auth';
// import { initializeApp } from 'supabase/app';
// import { getsupabase, collection, onSnapshot, query, where, doc } from 'supabase/supabase';

// // --- Type Definitions ---
// interface Author {
//     name: string;
// }

// interface Work {
//     id: string;
//     title: string;
//     category: '書籍' | '映画' | 'ゲーム' | 'その他';
//     genre: string;
//     authorNames: string; // 結合された著者名
//     releaseYear: number;
//     claps: number;
//     imageUrl: string;
// }

// // Global Variables (Provided by Canvas Environment)
// declare const __app_id: string;
// declare const __supabase_config: string;
// declare const __initial_auth_token: string | undefined;

// // --- Mock Data and Constants ---

// const MOCK_WORKS: Work[] = [
//     { id: 'w1', title: '時をかける少女', category: '書籍', genre: 'SF', authorNames: '筒井康隆', releaseYear: 1967, claps: 230, imageUrl: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
//     { id: 'w2', title: '天空の城ラピュタ', category: '映画', genre: 'ファンタジー', authorNames: '宮崎駿', releaseYear: 1986, claps: 155, imageUrl: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
//     { id: 'w3', title: 'ゼルダの伝説', category: 'ゲーム', genre: 'アドベンチャー', authorNames: '宮本茂', releaseYear: 1986, claps: 420, imageUrl: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
//     { id: 'w4', title: '星の王子さま', category: '書籍', genre: '児童文学', authorNames: 'サン=テグジュペリ', releaseYear: 1943, claps: 88, imageUrl: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
//     { id: 'w5', title: 'インセプション', category: '映画', genre: 'SF', authorNames: 'クリストファー・ノーラン', releaseYear: 2010, claps: 310, imageUrl: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
//     { id: 'w6', title: 'ファイナルファンタジー', category: 'ゲーム', genre: 'RPG', authorNames: '坂口博信', releaseYear: 1987, claps: 199, imageUrl: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
//     { id: 'w7', title: '沈黙の春', category: 'その他', genre: '環境問題', authorNames: 'レイチェル・カーソン', releaseYear: 1962, claps: 45, imageUrl: 'https://placehold.co/150x200/e6a117/000000?text=Other' },
//     { id: 'w8', title: '新世紀エヴァンゲリオン', category: '映画', genre: 'SF', authorNames: '庵野秀明', releaseYear: 1997, claps: 275, imageUrl: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
//     { id: 'w9', title: 'マリオカート', category: 'ゲーム', genre: 'レース', authorNames: '宮本茂', releaseYear: 1992, claps: 110, imageUrl: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
//     { id: 'w10', title: '銀河鉄道の夜', category: '書籍', genre: 'ファンタジー', authorNames: '宮沢賢治', releaseYear: 1927, claps: 350, imageUrl: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
// ];

// const ITEMS_PER_PAGE = 8;

// const CATEGORIES = ['すべて', '書籍', '映画', 'ゲーム', 'その他'] as const;
// type Category = typeof CATEGORIES[number];

// const GENRES: Record<Category, string[]> = {
//     'すべて': ['すべて'],
//     '書籍': ['すべて', 'フィクション', 'ノンフィクション', 'SF', 'ファンタジー', '児童文学'],
//     '映画': ['すべて', 'SF', 'ファンタジー', 'アクション', 'ドラマ', 'ドキュメンタリー'],
//     'ゲーム': ['すべて', 'RPG', 'アドベンチャー', 'アクション', 'レース'],
//     'その他': ['すべて', '環境問題', '歴史', '科学'],
// };

// const SORT_OPTIONS = [
//     { label: '新着順', value: 'newest' },
//     { label: '拍手数順', value: 'claps' },
//     { label: 'タイトル順', value: 'title' },
// ];

// // --- Sub-Components ---

// // ヘッダー (シンプルにモック)
// const Header: React.FC = () => (
//     <header className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto flex justify-between items-center">
//             <h1 className="text-2xl font-bold text-gray-800">
//                 <a href="/">作品管理</a>
//             </h1>
//             <nav className="hidden sm:block">
//                 <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">作品</span>
//                 <span className="ml-6 text-gray-500 hover:text-gray-700 cursor-pointer">ユーザー</span>
//             </nav>
//         </div>
//     </header>
// );

// // 作品カード
// const WorkCard: React.FC<{ work: Work }> = ({ work }) => (
//     <div
//         className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer border border-gray-100"
//         onClick={() => console.log(`作品詳細画面へ遷移: ${work.id}`)}
//         title={work.title}
//     >
//         <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
//             <img
//                 src={work.imageUrl}
//                 alt={work.title}
//                 className="object-cover h-full w-full"
//                 onError={(e) => {
//                     (e.target as HTMLImageElement).onerror = null;
//                     (e.target as HTMLImageElement).src = `https://placehold.co/150x200/4f46e5/ffffff?text=${work.category}`;
//                 }}
//             />
//         </div>
//         <div className="p-4">
//             <h3 className="text-lg font-bold text-gray-800 truncate mb-1" title={work.title}>{work.title}</h3>
//             <p className="text-sm text-gray-500 truncate mb-1">著者: {work.authorNames}</p>
//             <div className="flex items-center justify-between mt-2">
//                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${work.category === '書籍' ? 'bg-indigo-100 text-indigo-800' : work.category === '映画' ? 'bg-blue-100 text-blue-800' : work.category === 'ゲーム' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
//                     {work.category} / {work.releaseYear}
//                 </span>
//                 <div className="flex items-center text-red-500 font-semibold text-sm">
//                     <span className="mr-1">👏</span>
//                     {work.claps}
//                 </div>
//             </div>
//         </div>
//     </div>
// );

// // ページネーション
// interface PaginationProps {
//     currentPage: number;
//     totalPages: number;
//     onPageChange: (page: number) => void;
// }

// const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
//     if (totalPages <= 1) return null;

//     const getPageNumbers = () => {
//         const range = [];
//         const maxPagesToShow = 5;
//         let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//         let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//         if (endPage - startPage + 1 < maxPagesToShow) {
//             startPage = Math.max(1, endPage - maxPagesToShow + 1);
//         }

//         for (let i = startPage; i <= endPage; i++) {
//             range.push(i);
//         }
//         return range;
//     };

//     const pageNumbers = getPageNumbers();

//     const PageButton: React.FC<{ page: number }> = ({ page }) => (
//         <button
//             onClick={() => onPageChange(page)}
//             className={`px-4 py-2 mx-1 rounded-lg transition duration-150 ease-in-out text-sm ${page === currentPage
//                 ? 'bg-blue-600 text-white font-bold shadow-md'
//                 : 'bg-white text-gray-700 hover:bg-gray-100'
//                 }`}
//         >
//             {page}
//         </button>
//     );

//     return (
//         <div className="flex justify-center items-center mt-8 space-x-2">
//             <button
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-100 disabled:opacity-50 text-sm"
//             >
//                 &larr; 前へ
//             </button>

//             {pageNumbers.map((page) => (
//                 <PageButton key={page} page={page} />
//             ))}

//             <button
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-100 disabled:opacity-50 text-sm"
//             >
//                 次へ &rarr;
//             </button>
//         </div>
//     );
// };


// // --- Main Component ---

// export default function App() {
//     const [works, setWorks] = useState<Work[]>(MOCK_WORKS);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [categoryFilter, setCategoryFilter] = useState<Category>('すべて');
//     const [genreFilter, setGenreFilter] = useState('すべて');
//     const [sortOrder, setSortOrder] = useState('newest');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [authReady, setAuthReady] = useState(false);
//     const [userId, setUserId] = useState<string | null>(null);

//     // --- supabase/Auth Setup ---
//     useEffect(() => {
//         try {
//             const supabaseConfig = JSON.parse(__supabase_config);
//             const app = initializeApp(supabaseConfig);
//             const auth = getAuth(app);
//             // const db = getsupabase(app); // supabase not strictly needed for this mock UI

//             const unsubscribe = onAuthStateChanged(auth, async (user) => {
//                 if (user) {
//                     setUserId(user.uid);
//                 } else {
//                     // Sign in anonymously if no token, or use token if available
//                     try {
//                         if (typeof __initial_auth_token !== 'undefined') {
//                             await signInWithCustomToken(auth, __initial_auth_token);
//                         } else {
//                             const anonymousUser = await signInAnonymously(auth);
//                             setUserId(anonymousUser.user.uid);
//                         }
//                     } catch (e) {
//                         console.error('supabase Auth Error:', e);
//                         setUserId(crypto.randomUUID()); // Fallback random ID if sign-in fails
//                     }
//                 }
//                 setAuthReady(true);
//             });

//             return () => unsubscribe();
//         } catch (e) {
//             console.error('supabase Initialization Error:', e);
//             setAuthReady(true); // Proceed with UI even if auth fails
//             setUserId(crypto.randomUUID());
//         }
//     }, []);

//     // --- Filtering and Sorting Logic ---
//     const filteredAndSortedWorks = useMemo(() => {
//         let result = [...works];

//         // 1. Filtering by Search Term
//         if (searchTerm) {
//             const lowerCaseSearch = searchTerm.toLowerCase();
//             result = result.filter(
//                 (work) =>
//                     work.title.toLowerCase().includes(lowerCaseSearch) ||
//                     work.authorNames.toLowerCase().includes(lowerCaseSearch) ||
//                     work.genre.toLowerCase().includes(lowerCaseSearch)
//             );
//         }

//         // 2. Filtering by Category
//         if (categoryFilter !== 'すべて') {
//             result = result.filter((work) => work.category === categoryFilter);
//         }

//         // 3. Filtering by Genre
//         if (genreFilter !== 'すべて') {
//             result = result.filter((work) => work.genre === genreFilter);
//         }

//         // 4. Sorting
//         result.sort((a, b) => {
//             switch (sortOrder) {
//                 case 'newest':
//                     // Mock data uses year/id for sorting, treating higher ID as newer for simplicity
//                     return b.releaseYear - a.releaseYear || (b.id > a.id ? 1 : -1);
//                 case 'claps':
//                     return b.claps - a.claps;
//                 case 'title':
//                     return a.title.localeCompare(b.title, 'ja');
//                 default:
//                     return 0;
//             }
//         });

//         return result;
//     }, [works, searchTerm, categoryFilter, genreFilter, sortOrder]);

//     // --- Pagination Calculation ---
//     const totalWorks = filteredAndSortedWorks.length;
//     const totalPages = Math.ceil(totalWorks / ITEMS_PER_PAGE);

//     const paginatedWorks = useMemo(() => {
//         const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//         return filteredAndSortedWorks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//     }, [filteredAndSortedWorks, currentPage]);

//     // Reset page when filters change
//     useEffect(() => {
//         setCurrentPage(1);
//     }, [searchTerm, categoryFilter, genreFilter, sortOrder]);


//     // --- Event Handlers ---

//     const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
//         const newCategory = e.target.value as Category;
//         setCategoryFilter(newCategory);
//         // Reset genre when category changes
//         setGenreFilter('すべて');
//     }, []);

//     const handleNewWorkClick = () => {
//         console.log('/works/new へ遷移');
//         // Implement navigation logic here (e.g., router.push('/works/new'))
//     };

//     if (!authReady) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-50">
//                 <div className="text-lg font-semibold text-gray-600">認証中...</div>
//             </div>
//         );
//     }

//     // Determine available genres based on selected category
//     const availableGenres = GENRES[categoryFilter];

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
//             <Header />

//             <main className="flex flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                 {/* Sidebar (Mocked for layout) */}
//                 <aside className="hidden lg:block w-64 mr-8 p-4 bg-white rounded-xl shadow-lg h-full sticky top-24">
//                     <h2 className="text-xl font-bold mb-4 text-gray-700">ナビゲーション</h2>
//                     <ul className="space-y-2">
//                         <li><span className="block p-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">作品一覧</span></li>
//                         <li><span className="block p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">マイページ</span></li>
//                         <li><span className="block p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">設定</span></li>
//                     </ul>
//                     {userId && (
//                         <div className="mt-8 pt-4 border-t text-xs text-gray-500 break-all">
//                             <p>User ID: {userId}</p>
//                         </div>
//                     )}
//                 </aside>

//                 {/* Main Content Area */}
//                 <div className="flex-1">
//                     <h2 className="text-3xl font-extrabold text-gray-900 mb-6">作品一覧</h2>

//                     {/* Search and Filter Bar */}
//                     <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 space-y-4">
//                         <div className="flex flex-wrap gap-3 items-center">
//                             {/* Search Box */}
//                             <input
//                                 type="text"
//                                 placeholder="🔍 作品を検索..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
//                             />

//                             {/* Category Dropdown */}
//                             <select
//                                 value={categoryFilter}
//                                 onChange={handleCategoryChange}
//                                 className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
//                             >
//                                 {CATEGORIES.map(cat => (
//                                     <option key={cat} value={cat}>{cat}▼</option>
//                                 ))}
//                             </select>

//                             {/* Genre Dropdown */}
//                             <select
//                                 value={genreFilter}
//                                 onChange={(e) => setGenreFilter(e.target.value)}
//                                 className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
//                                 disabled={categoryFilter === 'すべて'}
//                             >
//                                 {availableGenres.map(genre => (
//                                     <option key={genre} value={genre}>{genre}▼</option>
//                                 ))}
//                             </select>

//                             {/* Sort Dropdown */}
//                             <select
//                                 value={sortOrder}
//                                 onChange={(e) => setSortOrder(e.target.value)}
//                                 className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
//                             >
//                                 {SORT_OPTIONS.map(opt => (
//                                     <option key={opt.value} value={opt.value}>{opt.label}▼</option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* New Work Button */}
//                         <button
//                             onClick={handleNewWorkClick}
//                             className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01] flex items-center justify-center"
//                         >
//                             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
//                             + 新しい作品を登録
//                         </button>
//                     </div>

//                     {/* Works List Header */}
//                     <div className="border-t border-b border-gray-300 py-3 mb-6 flex justify-between items-center">
//                         <h3 className="text-xl font-bold text-gray-800">【作品一覧】({totalWorks}件)</h3>
//                         {/* Loading/Error state could be shown here */}
//                     </div>

//                     {/* Works Grid */}
//                     {paginatedWorks.length > 0 ? (
//                         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                             {paginatedWorks.map((work) => (
//                                 <WorkCard key={work.id} work={work} />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-12 text-gray-500 text-lg">
//                             <p>該当する作品が見つかりませんでした。</p>
//                         </div>
//                     )}

//                     {/* Pagination */}
//                     <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={setCurrentPage}
//                     />
//                 </div>
//             </main>

//             {/* Footer (Mocked) */}
//             <footer className="bg-gray-800 text-white p-4 mt-12">
//                 <div className="max-w-7xl mx-auto text-center text-sm">
//                     &copy; {new Date().getFullYear()} 作品管理システム. All rights reserved.
//                 </div>
//             </footer>
//         </div>
//     );
// }
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// Firebase/Auth関連のimportは、静的ページ化のためすべて削除

// --- Type Definitions ---
interface Author {
    name: string;
}

// SupabaseのDBテーブルから取得されるデータ形式を想定
interface DBWork {
    id: string;
    title: string;
    category_id: '書籍' | '映画' | 'ゲーム' | 'その他'; // UI説明書のcategory_idに相当
    authors: Author[]; // jsonbを想定
    release_year: number;
    genres: string[]; // jsonbを想定 (ここではプライマリなジャンルのみ使用)
    claps: number; // 拍手数 (UI表示のために追加)
    image_url: string; // 作品画像URL (UI表示のために追加)
    // 他のフィールド (description, size, approved, created_by, intro_url, affiliate_url) は省略
}

// UI表示用のデータ形式 (フロントエンドで扱いやすいよう整形済み)
interface UIWork {
    id: string;
    title: string;
    category: '書籍' | '映画' | 'ゲーム' | 'その他';
    genre: string;
    authorNames: string; // 結合された著者名
    releaseYear: number;
    claps: number;
    imageUrl: string;
}

// DBWork -> UIWork 変換関数
// 実際のSupabaseデータ取得後にこの処理を行うことを想定
const dbWorkToUIWork = (dbWork: DBWork): UIWork => {
    return {
        id: dbWork.id,
        title: dbWork.title,
        category: dbWork.category_id,
        // 複数のジャンルがある場合、ここでは最初のジャンルを代表として使用
        genre: dbWork.genres.length > 0 ? dbWork.genres[0] : 'その他',
        // authors配列を結合して文字列に変換
        authorNames: dbWork.authors.map(a => a.name).join(', '),
        releaseYear: dbWork.release_year,
        claps: dbWork.claps,
        imageUrl: dbWork.image_url,
    };
};

// --- Mock Data (Supabase DB形式を模倣) and Constants ---

const SUPABASE_MOCK_DATA: DBWork[] = [
    { id: 'w1', title: '時をかける少女', category_id: '書籍', authors: [{ name: '筒井康隆' }], release_year: 1967, claps: 230, genres: ['SF'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
    { id: 'w2', title: '天空の城ラピュタ', category_id: '映画', authors: [{ name: '宮崎駿' }], release_year: 1986, claps: 155, genres: ['ファンタジー'], image_url: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
    { id: 'w3', title: 'ゼルダの伝説', category_id: 'ゲーム', authors: [{ name: '宮本茂' }], release_year: 1986, claps: 420, genres: ['アドベンチャー'], image_url: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
    { id: 'w4', title: '星の王子さま', category_id: '書籍', authors: [{ name: 'サン=テグジュペリ' }], release_year: 1943, claps: 88, genres: ['児童文学'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
    { id: 'w5', title: 'インセプション', category_id: '映画', authors: [{ name: 'クリストファー・ノーラン' }], release_year: 2010, claps: 310, genres: ['SF'], image_url: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
    { id: 'w6', title: 'ファイナルファンタジー', category_id: 'ゲーム', authors: [{ name: '坂口博信' }], release_year: 1987, claps: 199, genres: ['RPG'], image_url: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
    { id: 'w7', title: '沈黙の春', category_id: 'その他', authors: [{ name: 'レイチェル・カーソン' }], release_year: 1962, claps: 45, genres: ['環境問題'], image_url: 'https://placehold.co/150x200/e6a117/000000?text=Other' },
    { id: 'w8', title: '新世紀エヴァンゲリオン', category_id: '映画', authors: [{ name: '庵野秀明' }], release_year: 1997, claps: 275, genres: ['SF'], image_url: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
    { id: 'w9', title: 'マリオカート', category_id: 'ゲーム', authors: [{ name: '宮本茂' }], release_year: 1992, claps: 110, genres: ['レース'], image_url: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
    { id: 'w10', title: '銀河鉄道の夜', category_id: '書籍', authors: [{ name: '宮沢賢治' }], release_year: 1927, claps: 350, genres: ['ファンタジー'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
    { id: 'w11', title: '人間失格', category_id: '書籍', authors: [{ name: '太宰治' }], release_year: 1948, claps: 180, genres: ['小説'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
    { id: 'w12', title: '君の名は。', category_id: '映画', authors: [{ name: '新海誠' }], release_year: 2016, claps: 390, genres: ['ロマンス'], image_url: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
    // ページネーションテスト用にさらに追加
    { id: 'w13', title: 'ポケットモンスター', category_id: 'ゲーム', authors: [{ name: '田尻智' }], release_year: 1996, claps: 450, genres: ['RPG'], image_url: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
    { id: 'w14', title: '世界の歴史', category_id: 'その他', authors: [{ name: '多数' }], release_year: 2005, claps: 20, genres: ['歴史'], image_url: 'https://placehold.co/150x200/e6a117/000000?text=Other' },
    { id: 'w15', title: 'トイ・ストーリー', category_id: '映画', authors: [{ name: 'ジョン・ラセター' }], release_year: 1995, claps: 250, genres: ['アニメーション'], image_url: 'https://placehold.co/150x200/2c73d2/ffffff?text=Eiga' },
    { id: 'w16', title: '吾輩は猫である', category_id: '書籍', authors: [{ name: '夏目漱石' }], release_year: 1905, claps: 160, genres: ['小説'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
    { id: 'w17', title: 'Apex Legends', category_id: 'ゲーム', authors: [{ name: 'Respawn' }], release_year: 2019, claps: 130, genres: ['FPS'], image_url: 'https://placehold.co/150x200/18a883/ffffff?text=Game' },
    { id: 'w18', title: '宇宙兄弟', category_id: '書籍', authors: [{ name: '小山宙哉' }], release_year: 2007, claps: 210, genres: ['SF'], image_url: 'https://placehold.co/150x200/4c3298/ffffff?text=Shosetsu' },
];


const ITEMS_PER_PAGE = 8;

const CATEGORIES = ['すべて', '書籍', '映画', 'ゲーム', 'その他'] as const;
type Category = typeof CATEGORIES[number];

const GENRES: Record<Category, string[]> = {
    'すべて': ['すべて'],
    '書籍': ['すべて', 'フィクション', 'ノンフィクション', 'SF', 'ファンタジー', '児童文学', '小説'],
    '映画': ['すべて', 'SF', 'ファンタジー', 'アクション', 'ドラマ', 'ドキュメンタリー', 'ロマンス', 'アニメーション'],
    'ゲーム': ['すべて', 'RPG', 'アドベンチャー', 'アクション', 'レース', 'FPS'],
    'その他': ['すべて', '環境問題', '歴史', '科学'],
};

const SORT_OPTIONS = [
    { label: '新着順', value: 'newest' },
    { label: '拍手数順', value: 'claps' },
    { label: 'タイトル順', value: 'title' },
];

// --- Sub-Components ---

// ヘッダー (シンプルにモック)
const Header: React.FC = () => (
    <header className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
                <a href="#">作品管理</a>
            </h1>
            <nav className="hidden sm:block">
                <span className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1">作品</span>
                <span className="ml-6 text-gray-500 hover:text-gray-700 cursor-pointer">ユーザー</span>
            </nav>
        </div>
    </header>
);

// 作品カード
const WorkCard: React.FC<{ work: UIWork }> = ({ work }) => (
    <div
        className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer border border-gray-100"
        onClick={() => console.log(`作品詳細画面へ遷移: /works/${work.id}`)}
        title={work.title}
    >
        <div className="h-48 w-full bg-gray-100 flex items-center justify-center">
            <img
                src={work.imageUrl}
                alt={work.title}
                className="object-cover h-full w-full"
                onError={(e) => {
                    // 画像ロード失敗時のフォールバック
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = `https://placehold.co/150x200/4f46e5/ffffff?text=${work.category}`;
                }}
            />
        </div>
        <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800 truncate mb-1" title={work.title}>{work.title}</h3>
            <p className="text-sm text-gray-500 truncate mb-1">著者: {work.authorNames}</p>
            <div className="flex items-center justify-between mt-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${work.category === '書籍' ? 'bg-indigo-100 text-indigo-800' : work.category === '映画' ? 'bg-blue-100 text-blue-800' : work.category === 'ゲーム' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {work.category} / {work.releaseYear}
                </span>
                <div className="flex items-center text-red-500 font-semibold text-sm">
                    <span className="mr-1">👏</span>
                    {work.claps}
                </div>
            </div>
        </div>
    </div>
);

// ページネーション
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const range = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // ページ番号表示の間に "..." を挟むロジックは省略し、シンプルな表示に留める
        for (let i = startPage; i <= endPage; i++) {
            range.push(i);
        }
        return range;
    };

    const pageNumbers = getPageNumbers();

    const PageButton: React.FC<{ page: number }> = ({ page }) => (
        <button
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 mx-1 rounded-lg transition duration-150 ease-in-out text-sm ${page === currentPage
                ? 'bg-blue-600 text-white font-bold shadow-md'
                : 'bg-white text-gray-700 border hover:bg-gray-100'
                }`}
        >
            {page}
        </button>
    );

    return (
        <div className="flex justify-center items-center mt-8 space-x-2">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-100 disabled:opacity-50 text-sm"
            >
                &larr; 前へ
            </button>

            {pageNumbers.map((page) => (
                <PageButton key={page} page={page} />
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-white text-gray-700 border hover:bg-gray-100 disabled:opacity-50 text-sm"
            >
                次へ &rarr;
            </button>
        </div>
    );
};


// --- Main Component ---

// DB形式のモックデータをUI形式に変換して初期化
const initialWorks: UIWork[] = SUPABASE_MOCK_DATA.map(dbWorkToUIWork);

export default function App() {
    const [works, setWorks] = useState<UIWork[]>(initialWorks);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<Category>('すべて');
    const [genreFilter, setGenreFilter] = useState('すべて');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);

    // Auth関連のstateは削除し、静的ページとして処理

    // --- Filtering and Sorting Logic ---
    const filteredAndSortedWorks = useMemo(() => {
        let result = [...works];

        // 1. Filtering by Search Term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            result = result.filter(
                (work) =>
                    work.title.toLowerCase().includes(lowerCaseSearch) ||
                    work.authorNames.toLowerCase().includes(lowerCaseSearch) ||
                    work.genre.toLowerCase().includes(lowerCaseSearch)
            );
        }

        // 2. Filtering by Category
        if (categoryFilter !== 'すべて') {
            result = result.filter((work) => work.category === categoryFilter);
        }

        // 3. Filtering by Genre
        if (genreFilter !== 'すべて') {
            // genreはUIWorkで一つしか持たないため、シンプルに比較
            result = result.filter((work) => work.genre === genreFilter);
        }

        // 4. Sorting
        result.sort((a, b) => {
            switch (sortOrder) {
                case 'newest':
                    // Mock dataではreleaseYearでソート
                    return b.releaseYear - a.releaseYear || (b.id > a.id ? 1 : -1);
                case 'claps':
                    return b.claps - a.claps;
                case 'title':
                    return a.title.localeCompare(b.title, 'ja');
                default:
                    return 0;
            }
        });

        return result;
    }, [works, searchTerm, categoryFilter, genreFilter, sortOrder]);

    // --- Pagination Calculation ---
    const totalWorks = filteredAndSortedWorks.length;
    const totalPages = Math.ceil(totalWorks / ITEMS_PER_PAGE);

    const paginatedWorks = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredAndSortedWorks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredAndSortedWorks, currentPage]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, categoryFilter, genreFilter, sortOrder]);


    // --- Event Handlers ---

    const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as Category;
        setCategoryFilter(newCategory);
        // カテゴリ変更時にジャンルをリセット
        setGenreFilter('すべて');
    }, []);

    const handleNewWorkClick = () => {
        console.log('/works/new へ遷移 (静的モック)');
        // Implement navigation logic here (e.g., router.push('/works/new'))
    };

    // Determine available genres based on selected category
    const availableGenres = GENRES[categoryFilter];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <main className="flex flex-1 max-w-7xl w-full mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Sidebar (Mocked for layout) */}
                <aside className="hidden lg:block w-64 mr-8 p-4 bg-white rounded-xl shadow-lg h-full sticky top-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">ナビゲーション</h2>
                    <ul className="space-y-2">
                        <li><span className="block p-2 rounded-lg bg-blue-50 text-blue-700 font-semibold">作品一覧</span></li>
                        <li><span className="block p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">マイページ</span></li>
                        <li><span className="block p-2 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">設定</span></li>
                    </ul>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-6">作品一覧</h2>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-8 space-y-4">
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Search Box */}
                            <input
                                type="text"
                                placeholder="🔍 作品を検索..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 min-w-[150px] p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                            />

                            {/* Category Dropdown */}
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}▼</option>
                                ))}
                            </select>

                            {/* Genre Dropdown */}
                            <select
                                value={genreFilter}
                                onChange={(e) => setGenreFilter(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                disabled={categoryFilter === 'すべて'}
                            >
                                {availableGenres.map(genre => (
                                    <option key={genre} value={genre}>{genre}▼</option>
                                ))}
                            </select>

                            {/* Sort Dropdown */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                            >
                                {SORT_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}▼</option>
                                ))}
                            </select>
                        </div>

                        {/* New Work Button */}
                        <button
                            onClick={handleNewWorkClick}
                            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 transform hover:scale-[1.01] flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            + 新しい作品を登録
                        </button>
                    </div>

                    {/* Works List Header */}
                    <div className="border-t border-b border-gray-300 py-3 mb-6 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-gray-800">【作品一覧】({totalWorks}件)</h3>
                    </div>

                    {/* Works Grid */}
                    {paginatedWorks.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {paginatedWorks.map((work) => (
                                <WorkCard key={work.id} work={work} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500 text-lg">
                            <p>該当する作品が見つかりませんでした。</p>
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </main>

            {/* Footer (Mocked) */}
            <footer className="bg-gray-800 text-white p-4 mt-12">
                <div className="max-w-7xl mx-auto text-center text-sm">
                    &copy; {new Date().getFullYear()} 作品管理システム. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

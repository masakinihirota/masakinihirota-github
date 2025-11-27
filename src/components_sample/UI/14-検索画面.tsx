"use client";

// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { initializeApp } from 'supabase/app';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'supabase/auth';
// import { getsupabase, collection, query, onSnapshot, getDocs } from 'supabase/supabase';

// // --- Icon Components (Simulated using SVG for single-file mandate) ---
// const Search = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
// );
// const Menu = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
// );
// const Book = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
// );
// const User = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
// );
// const Lightbulb = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-.8.8-1.7 1.4-2.4C17 10.9 18 9.2 18 8a6 6 0 0 0-6-6h0c-3.6 0-6 2.5-6 6 0 1.2.5 2.5 1.1 3.4L12 18" /><path d="M8 22v-2h8v2" /><path d="M12 2v10" /></svg>
// );
// const Settings = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44c-.6.28-1.15.63-1.63 1.07l-.28.28a2 2 0 0 0-.7 2.83l.28.28c.44.48.79 1.03 1.07 1.63h-.44a2 2 0 0 0-2 2v.44c.28.6.63 1.15 1.07 1.63l.28.28a2 2 0 0 0 2.83.7l.28-.28c.48-.44 1.03-.79 1.63-1.07v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.44c.6-.28 1.15-.63 1.63-1.07l.28-.28a2 2 0 0 0 .7-2.83l-.28-.28c-.44-.48-.79-1.03-1.07-1.63h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2v-.44c-.28-.6-.63-1.15-1.07-1.63l-.28-.28a2 2 0 0 0-2.83-.7l-.28.28c-.48.44-1.03.79-1.63 1.07v-.44a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
// );
// const List = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
// );
// const Link = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
// );
// const ArrowLeft = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
// );
// const ArrowRight = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
// );
// const AlertTriangle = (props) => (
//     <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
// );

// // --- Mock Data Simulation ---
// const MOCK_RESULTS_DATA = [
//     { id: 'w1', type: 'Work', title: '成長マインドセットの技術', category: '書籍', author: '著者A', description: '固定観念を打ち破り、可能性を最大限に引き出すための実践的なガイド。' },
//     { id: 'p1', type: 'User', name: '佐藤 ケン', profile: 'ReactとDrizzleを愛用するフロントエンド開発者。新しい技術の探求が趣味。', skills: ['プログラミング', 'デザイン', 'リーダーシップ'] },
//     { id: 'v1', type: 'Value', name: '持続可能性への貢献', category: '社会', question: '私たちは次の世代のために何を残すべきか？具体的な行動を議論する。' },
//     { id: 's1', type: 'Skill', name: 'TypeScript/Next.js', description: 'モダンなWebアプリケーション開発に必要なスキルセット。静的型付けの恩恵を受ける。' },
//     { id: 'l1', type: 'List', name: '読破すべき技術書10選', description: 'キャリアアップに直結する、厳選された技術書リスト。', owner: '山田 太郎' },
//     { id: 'c1', type: 'Chain', name: '自己成長のロードマップ', description: '目標設定から実行、振り返りまでの継続的な学習サイクル。', steps: 5 },
//     { id: 'w2', type: 'Work', title: 'HonoによるAPI開発', category: '記事', author: '著者B', description: '軽量で高速なエッジ対応フレームワークHonoの基礎から応用までを解説。' },
//     { id: 'p2', type: 'User', name: '田中 リサ', profile: 'UXデザインと情報アーキテクチャの専門家。ユーザー中心の設計を追求。', skills: ['UXデザイン', '情報設計'] },
//     { id: 'v2', type: 'Value', name: '自由と規律のバランス', category: '哲学', question: '個人と組織における自由な発想と、それを支える規律の理想的な関係とは。' },
// ];

// // Duplicate mock data to simulate many results for pagination
// const ALL_MOCK_RESULTS = Array.from({ length: 45 }, (_, i) => {
//     const original = MOCK_RESULTS_DATA[i % MOCK_RESULTS_DATA.length];
//     return {
//         ...original,
//         id: original.id + '-' + (i + 1),
//         title: original.title ? `${original.title} #${i + 1}` : undefined,
//         name: original.name ? `${original.name} #${i + 1}` : undefined,
//         description: original.description ? `${original.description.substring(0, 30)}...` : undefined,
//     };
// });

// const ITEMS_PER_PAGE = 10;
// const TABS = [
//     { label: 'すべて', key: 'All', icon: Search, color: 'text-indigo-500' },
//     { label: '作品', key: 'Work', icon: Book, color: 'text-sky-500' },
//     { label: 'ユーザー', key: 'User', icon: User, color: 'text-teal-500' },
//     { label: '価値観', key: 'Value', icon: Lightbulb, color: 'text-amber-500' },
//     { label: 'スキル', key: 'Skill', icon: Settings, color: 'text-slate-500' },
//     { label: 'リスト', key: 'List', icon: List, color: 'text-pink-500' },
//     { label: 'チェーン', key: 'Chain', icon: Link, color: 'text-green-500' },
// ];


// // --- Sub Components ---

// // 1. Sidebar Placeholder
// const Sidebar = ({ activeTab, onTabChange }) => (
//     <div className="flex-shrink-0 w-64 p-4 space-y-2 bg-white border-r border-gray-100 hidden lg:block">
//         <h2 className="text-lg font-bold text-gray-800 mb-4">メニュー</h2>
//         {TABS.map(tab => (
//             <button
//                 key={tab.key}
//                 onClick={() => onTabChange(tab.key)}
//                 className={`flex items-center w-full p-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
//                     }`}
//             >
//                 <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.key ? tab.color : 'text-gray-400'}`} />
//                 {tab.label}
//             </button>
//         ))}
//     </div>
// );

// // 2. Result Card Component
// const ResultCard = ({ result }) => {
//     const tabInfo = TABS.find(t => t.key === result.type) || TABS[0];
//     const Icon = tabInfo.icon;
//     const typeLabel = tabInfo.label;
//     const typeColor = tabInfo.color;

//     const renderDetails = () => {
//         switch (result.type) {
//             case 'Work':
//                 return (
//                     <>
//                         <p className="text-xs text-gray-500 mt-1">カテゴリ: {result.category}</p>
//                         <p className="text-xs text-gray-500">著者: {result.author}</p>
//                         <p className="mt-2 text-sm text-gray-700 truncate">{result.description}</p>
//                     </>
//                 );
//             case 'User':
//                 return (
//                     <>
//                         <p className="mt-1 text-sm text-gray-700 truncate">プロフィール: {result.profile}</p>
//                         <p className="text-xs text-gray-500 mt-1">スキル: {result.skills.join(', ')}</p>
//                     </>
//                 );
//             case 'Value':
//                 return (
//                     <>
//                         <p className="text-xs text-gray-500 mt-1">カテゴリ: {result.category}</p>
//                         <p className="mt-2 text-sm text-gray-700 italic truncate">質問: {result.question}</p>
//                     </>
//                 );
//             case 'Skill':
//                 return (
//                     <>
//                         <p className="mt-2 text-sm text-gray-700 truncate">概要: {result.description}</p>
//                     </>
//                 );
//             case 'List':
//                 return (
//                     <>
//                         <p className="text-xs text-gray-500 mt-1">作成者: {result.owner}</p>
//                         <p className="mt-2 text-sm text-gray-700 truncate">説明: {result.description}</p>
//                     </>
//                 );
//             case 'Chain':
//                 return (
//                     <>
//                         <p className="text-xs text-gray-500 mt-1">ステップ数: {result.steps}</p>
//                         <p className="mt-2 text-sm text-gray-700 truncate">説明: {result.description}</p>
//                     </>
//                 );
//             default:
//                 return null;
//         }
//     };

//     const title = result.title || result.name || result.question || result.description.substring(0, 30) + '...';

//     // Mock link for navigation
//     const navPath = `/${result.type.toLowerCase()}s/${result.id}`;

//     return (
//         <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
//             <div className="flex items-start justify-between">
//                 <div className="flex items-center">
//                     <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${typeColor}`} />
//                     <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
//                         {title}
//                     </h3>
//                 </div>
//                 <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-4 hidden sm:block`}>{typeLabel}</span>
//             </div>

//             <div className="mt-3 border-l-4 pl-4" style={{ borderColor: typeColor.replace('text-', '#').replace('-500', '500') }}>
//                 {renderDetails()}
//             </div>

//             <div className="mt-4 flex justify-end">
//                 <a href={navPath} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100">
//                     詳細を見る &rarr;
//                 </a>
//             </div>
//         </div>
//     );
// };

// // 3. Pagination Component
// const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
//     const totalPages = Math.ceil(totalItems / itemsPerPage);
//     if (totalPages <= 1) return null;

//     const pageNumbers = [];
//     for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//     }

//     // Determine which pages to show (simplified: show first 3, last 1, and current neighbors)
//     const renderPages = useMemo(() => {
//         const pages = [];
//         const maxVisible = 5;

//         if (totalPages <= maxVisible) {
//             return pageNumbers;
//         }

//         pages.push(1);

//         let start = Math.max(2, currentPage - 1);
//         let end = Math.min(totalPages - 1, currentPage + 1);

//         if (currentPage > 3) pages.push('...');

//         for (let i = start; i <= end; i++) {
//             if (!pages.includes(i)) pages.push(i);
//         }

//         if (currentPage < totalPages - 2) pages.push('...');

//         if (!pages.includes(totalPages)) pages.push(totalPages);

//         return pages.filter((value, index, self) =>
//             self.indexOf(value) === index || value === '...'
//         ).sort((a, b) => {
//             if (a === '...') return 1;
//             if (b === '...') return -1;
//             return a - b;
//         });

//     }, [totalPages, currentPage]);

//     const PageButton = ({ page, isActive, isEllipsis }) => (
//         <button
//             onClick={() => onPageChange(page)}
//             disabled={isEllipsis}
//             className={`mx-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${isActive
//                 ? 'bg-indigo-600 text-white shadow-md'
//                 : isEllipsis
//                     ? 'text-gray-500 cursor-default'
//                     : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-indigo-600 border border-gray-200'
//                 }`}
//         >
//             {page}
//         </button>
//     );

//     return (
//         <div className="flex justify-center items-center space-x-1 mt-8 mb-4">
//             <button
//                 onClick={() => onPageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//                 <ArrowLeft className="w-4 h-4 mr-1" />
//                 前へ
//             </button>

//             {renderPages.map((page, index) => (
//                 <React.Fragment key={index}>
//                     {page === '...' ? (
//                         <span className="text-gray-500 px-2">...</span>
//                     ) : (
//                         <PageButton page={page} isActive={page === currentPage} />
//                     )}
//                 </React.Fragment>
//             ))}

//             <button
//                 onClick={() => onPageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//                 次へ
//                 <ArrowRight className="w-4 h-4 ml-1" />
//             </button>
//         </div>
//     );
// };

// // --- Main Application Component ---
// export default function App() {
//     // --- State Management ---
//     const [searchTerm, setSearchTerm] = useState('');
//     const [activeTab, setActiveTab] = useState('All');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile sidebar

//     // --- supabase/supabase State (MANDATORY) ---
//     const [db, setDb] = useState(null);
//     const [auth, setAuth] = useState(null);
//     const [userId, setUserId] = useState(null);
//     const [isAuthReady, setIsAuthReady] = useState(false);
//     const [supabaseError, setsupabaseError] = useState(null);

//     // --- supabase Initialization (MANDATORY) ---
//     useEffect(() => {
//         const initializesupabase = async () => {
//             try {
//                 // Global variables from the environment
//                 const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
//                 const supabaseConfig = typeof __supabase_config !== 'undefined' ? JSON.parse(__supabase_config) : null;
//                 const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

//                 if (!supabaseConfig) {
//                     throw new Error("supabase config not available.");
//                 }

//                 // 1. Initialize App and Services
//                 const app = initializeApp(supabaseConfig);
//                 const supabaseDb = getsupabase(app);
//                 const supabaseAuth = getAuth(app);

//                 setDb(supabaseDb);
//                 setAuth(supabaseAuth);

//                 // 2. Auth Listener & Sign-in
//                 const unsubscribe = onAuthStateChanged(supabaseAuth, async (user) => {
//                     if (user) {
//                         setUserId(user.uid);
//                     } else {
//                         // Sign in anonymously if no token is available/provided
//                         if (!initialAuthToken) {
//                             const anonUser = await signInAnonymously(supabaseAuth);
//                             setUserId(anonUser.user.uid);
//                         }
//                     }
//                     setIsAuthReady(true);
//                 });

//                 // Use custom token if available
//                 if (initialAuthToken) {
//                     await signInWithCustomToken(supabaseAuth, initialAuthToken);
//                 }

//                 return () => unsubscribe();
//             } catch (error) {
//                 console.error("supabase initialization or authentication failed:", error);
//                 setsupabaseError("supabaseの初期化に失敗しました。認証サービスを確認してください。");
//                 setIsAuthReady(true); // Stop loading regardless of success
//             }
//         };

//         initializesupabase();
//     }, []);

//     // --- Filtering and Pagination Logic ---

//     // Simple keyword filtering (simulating Full-Text Search)
//     const filteredResults = useMemo(() => {
//         let results = ALL_MOCK_RESULTS;
//         const normalizedSearchTerm = searchTerm.toLowerCase().trim();

//         // 1. Filter by Category Tab
//         if (activeTab !== 'All') {
//             results = results.filter(item => item.type === activeTab);
//         }

//         // 2. Filter by Search Term (Case-insensitive matching across relevant fields)
//         if (normalizedSearchTerm) {
//             results = results.filter(item => {
//                 const searchFields = [
//                     item.title, item.name, item.description, item.category, item.author, item.question,
//                     (item.skills ? item.skills.join(' ') : null), item.profile
//                 ].map(field => (field || '').toLowerCase());

//                 return searchFields.some(field => field.includes(normalizedSearchTerm));
//             });
//         }

//         return results;
//     }, [activeTab, searchTerm]);

//     // Apply Pagination
//     const paginatedResults = useMemo(() => {
//         const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//         return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//     }, [filteredResults, currentPage]);

//     const totalResults = filteredResults.length;
//     const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

//     // Effect to reset page when filters change
//     useEffect(() => {
//         setCurrentPage(1);
//         // Simulate loading on new search/filter
//         setIsLoading(true);
//         const timer = setTimeout(() => setIsLoading(false), 300); // Debounce simulation
//         return () => clearTimeout(timer);
//     }, [activeTab, searchTerm]);

//     const handleSearchChange = (event) => {
//         setSearchTerm(event.target.value);
//         setCurrentPage(1);
//     };

//     const handleTabChange = (key) => {
//         setActiveTab(key);
//     };

//     const handlePageChange = useCallback((page) => {
//         if (page >= 1 && page <= totalPages) {
//             setCurrentPage(page);
//             window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top on page change
//         }
//     }, [totalPages]);

//     // --- Placeholder Components for Layout Consistency ---
//     const Header = () => (
//         <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
//                 <div className="text-xl font-bold text-indigo-600">App Name</div>
//                 <div className="lg:hidden">
//                     <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
//                         <Menu className="w-6 h-6" />
//                     </button>
//                 </div>
//                 <div className="hidden lg:flex space-x-4">
//                     <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium">HOME</a>
//                     <a href="/search" className="text-indigo-600 font-medium border-b-2 border-indigo-600">検索</a>
//                     {/* Placeholder for user info/profile */}
//                 </div>
//             </div>
//         </header>
//     );

//     const Footer = () => (
//         <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
//                 &copy; 2024 App Name. All rights reserved. | User ID: {userId || 'N/A'}
//             </div>
//         </footer>
//     );

//     const MobileSidebar = () => (
//         <div className={`fixed inset-0 z-20 bg-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden p-6`}>
//             <div className="flex justify-end">
//                 <button onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 text-3xl">&times;</button>
//             </div>
//             <Sidebar activeTab={activeTab} onTabChange={(key) => { handleTabChange(key); setIsMenuOpen(false); }} />
//             <div className="mt-8 pt-4 border-t border-gray-200 space-y-2">
//                 <a href="/" className="block text-gray-600 hover:text-indigo-600 font-medium">HOME</a>
//                 <a href="/search" className="block text-indigo-600 font-medium">検索</a>
//             </div>
//         </div>
//     );

//     // --- Content Render Helpers ---

//     const renderLoading = () => (
//         <div className="space-y-6 animate-pulse">
//             <div className="h-6 bg-gray-200 rounded w-1/4"></div>
//             {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
//                 <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-md">
//                     <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
//                     <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
//                     <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
//                     <div className="h-8 bg-indigo-100 rounded-lg w-24 float-right"></div>
//                 </div>
//             ))}
//         </div>
//     );

//     const renderEmptyState = () => (
//         <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
//             <Search className="w-12 h-12 mx-auto text-indigo-400" />
//             <h4 className="mt-4 text-xl font-semibold text-gray-900">
//                 検索結果が見つかりませんでした。
//             </h4>
//             <p className="mt-2 text-gray-500">
//                 別のキーワードやカテゴリでお試しください。
//             </p>
//         </div>
//     );

//     const renderErrorState = (message) => (
//         <div className="text-center py-16 bg-red-50 rounded-xl shadow-md border border-red-300 mt-6">
//             <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
//             <h4 className="mt-4 text-xl font-semibold text-red-800">
//                 ⚠️ エラーが発生しました
//             </h4>
//             <p className="mt-2 text-red-600">
//                 {message || "検索に失敗しました。もう一度お試しください。"}
//             </p>
//         </div>
//     );

//     // --- Main Render ---

//     return (
//         <div className="min-h-screen bg-gray-50 font-sans">
//             <Header />
//             <MobileSidebar />

//             <main className="max-w-7xl mx-auto flex">
//                 {/* 1. Sidebar (PC/Tablet) */}
//                 <div className="hidden lg:block">
//                     <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
//                 </div>

//                 {/* 2. Main Content Area */}
//                 <div className="flex-grow p-4 sm:p-6 lg:p-8">
//                     <h1 className="text-3xl font-extrabold text-gray-900 mb-6">統合検索</h1>

//                     {/* Error Display */}
//                     {supabaseError && renderErrorState(supabaseError)}

//                     {/* Search Bar */}
//                     <div className="relative mb-6">
//                         <input
//                             type="text"
//                             placeholder="🔍 キーワードを入力..."
//                             value={searchTerm}
//                             onChange={handleSearchChange}
//                             onKeyDown={(e) => { if (e.key === 'Enter') setCurrentPage(1); }}
//                             className="w-full p-3 pl-12 text-lg border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition duration-150 shadow-md"
//                             disabled={!isAuthReady || isLoading}
//                         />
//                         <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400" />
//                     </div>

//                     {/* Category Tabs (Horizontal Scroll on Mobile) */}
//                     <div className="flex overflow-x-auto whitespace-nowrap space-x-2 pb-3 mb-6 border-b border-gray-200 sm:justify-start justify-center">
//                         {TABS.map((tab) => (
//                             <button
//                                 key={tab.key}
//                                 onClick={() => handleTabChange(tab.key)}
//                                 className={`
//                                     px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200
//                                     ${activeTab === tab.key
//                                         ? 'bg-indigo-600 text-white shadow-lg'
//                                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                                     }
//                                     flex items-center
//                                 `}
//                                 disabled={!isAuthReady || isLoading}
//                             >
//                                 <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.key ? 'text-white' : tab.color}`} />
//                                 {tab.label}
//                             </button>
//                         ))}
//                     </div>

//                     {/* Search Results Display */}
//                     <div className="mt-8">
//                         {/* Result Header */}
//                         <div className="flex justify-between items-center pb-2 border-b-2 border-indigo-400">
//                             <h2 className="text-xl font-bold text-gray-800">
//                                 検索結果
//                             </h2>
//                             <span className="text-md font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
//                                 ({totalResults}件)
//                             </span>
//                         </div>

//                         {/* Result List */}
//                         {isLoading ? (
//                             renderLoading()
//                         ) : (
//                             <div className="mt-6 space-y-6">
//                                 {totalResults === 0 ? (
//                                     renderEmptyState()
//                                 ) : (
//                                     <>
//                                         {paginatedResults.map((result) => (
//                                             <ResultCard key={result.id} result={result} />
//                                         ))}
//                                         <Pagination
//                                             totalItems={totalResults}
//                                             itemsPerPage={ITEMS_PER_PAGE}
//                                             currentPage={currentPage}
//                                             onPageChange={handlePageChange}
//                                         />
//                                     </>
//                                 )}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </main>

//             <Footer />
//         </div>
//     );
// }
import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- Supabase/Drizzleを想定したデータ型定義 ---
/**
 * @typedef {Object} Work
 * @property {string} id
 * @property {'Work'} type
 * @property {string} title
 * @property {string} category
 * @property {string} author
 * @property {string} description
 */
/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {'User'} type
 * @property {string} name
 * @property {string} profile
 * @property {string[]} skills
 */
/**
 * @typedef {Object} Value
 * @property {string} id
 * @property {'Value'} type
 * @property {string} name
 * @property {string} category
 * @property {string} question
 */
/**
 * @typedef {Object} Skill
 * @property {string} id
 * @property {'Skill'} type
 * @property {string} name
 * @property {string} description
 */
/**
 * @typedef {Object} List
 * @property {string} id
 * @property {'List'} type
 * @property {string} name
 * @property {string} description
 * @property {string} owner
 */
/**
 * @typedef {Object} Chain
 * @property {string} id
 * @property {'Chain'} type
 * @property {string} name
 * @property {string} description
 * @property {number} steps
 */

/**
 * @typedef {Work | Profile | Value | Skill | List | Chain} SearchResult
 */

// --- Icon Components (Simulated using SVG for single-file mandate) ---
const Search = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const Menu = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
);
const Book = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
);
const User = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const Lightbulb = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-.8.8-1.7 1.4-2.4C17 10.9 18 9.2 18 8a6 6 0 0 0-6-6h0c-3.6 0-6 2.5-6 6 0 1.2.5 2.5 1.1 3.4L12 18" /><path d="M8 22v-2h8v2" /><path d="M12 2v10" /></svg>
);
const Settings = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.44c-.6.28-1.15.63-1.63 1.07l-.28.28a2 2 0 0 0-.7 2.83l.28.28c.44.48.79 1.03 1.07 1.63h-.44a2 2 0 0 0-2 2v.44c.28.6.63 1.15 1.07 1.63l.28.28a2 2 0 0 0 2.83.7l.28-.28c.48-.44 1.03-.79 1.63-1.07v.44a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.44c.6-.28 1.15-.63 1.63-1.07l.28-.28a2 2 0 0 0 .7-2.83l-.28-.28c-.44-.48-.79-1.03-1.07-1.63h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2v-.44c-.28-.6-.63-1.15-1.07-1.63l-.28-.28a2 2 0 0 0-2.83-.7l-.28.28c-.48.44-1.03.79-1.63 1.07v-.44a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const List = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const Link = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
);
const ArrowLeft = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ArrowRight = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);

// --- ダミーデータ定義（Supabaseからの取得をシミュレート） ---
/** @type {Work[]} */
const MOCK_WORKS = [
    { id: 'w1', type: 'Work', title: '成長マインドセットの技術', category: '書籍', author: '著者A', description: '固定観念を打ち破り、可能性を最大限に引き出すための実践的なガイド。' },
    { id: 'w2', type: 'Work', title: 'HonoによるAPI開発', category: '記事', author: '著者B', description: '軽量で高速なエッジ対応フレームワークHonoの基礎から応用までを解説。' },
];
/** @type {Profile[]} */
const MOCK_PROFILES = [
    { id: 'p1', type: 'User', name: '佐藤 ケン', profile: 'ReactとDrizzleを愛用するフロントエンド開発者。新しい技術の探求が趣味。', skills: ['プログラミング', 'デザイン', 'リーダーシップ'] },
    { id: 'p2', type: 'User', name: '田中 リサ', profile: 'UXデザインと情報アーキテクチャの専門家。ユーザー中心の設計を追求。', skills: ['UXデザイン', '情報設計'] },
];
/** @type {Value[]} */
const MOCK_VALUES = [
    { id: 'v1', type: 'Value', name: '持続可能性への貢献', category: '社会', question: '私たちは次の世代のために何を残すべきか？具体的な行動を議論する。' },
    { id: 'v2', type: 'Value', name: '自由と規律のバランス', category: '哲学', question: '個人と組織における自由な発想と、それを支える規律の理想的な関係とは。' },
];
/** @type {Skill[]} */
const MOCK_SKILLS = [
    { id: 's1', type: 'Skill', name: 'TypeScript/Next.js', description: 'モダンなWebアプリケーション開発に必要なスキルセット。静的型付けの恩恵を受ける。' },
];
/** @type {List[]} */
const MOCK_LISTS = [
    { id: 'l1', type: 'List', name: '読破すべき技術書10選', description: 'キャリアアップに直結する、厳選された技術書リスト。', owner: '山田 太郎' },
];
/** @type {Chain[]} */
const MOCK_CHAINS = [
    { id: 'c1', type: 'Chain', name: '自己成長のロードマップ', description: '目標設定から実行、振り返りまでの継続的な学習サイクル。', steps: 5 },
];

const MOCK_RESULTS_DATA = [...MOCK_WORKS, ...MOCK_PROFILES, ...MOCK_VALUES, ...MOCK_SKILLS, ...MOCK_LISTS, ...MOCK_CHAINS];


// ダミーデータを複製して検索結果の総数を増やす
/** @type {SearchResult[]} */
const ALL_MOCK_RESULTS = Array.from({ length: 45 }, (_, i) => {
    const original = MOCK_RESULTS_DATA[i % MOCK_RESULTS_DATA.length];
    /** @type {SearchResult} */
    const item = { ...original };

    // IDとタイトルをユニークにする
    item.id = original.id + '-' + (i + 1);
    if (item.type === 'Work' || item.type === 'Skill' || item.type === 'List' || item.type === 'Chain') {
        item.title = `${original.title} #${i + 1}`;
    } else if (item.type === 'User' || item.type === 'Value') {
        item.name = `${original.name} #${i + 1}`;
    }

    // 説明文を短縮
    if (item.description) {
        item.description = `${original.description.substring(0, 30)}...`;
    }

    // ユーザーと価値観にキーワードを仕込む（フィルタリングテスト用）
    if (i === 15) item.name = "テストユーザー - Next.js";
    if (i === 25) item.description = "この作品にはSupabaseが言及されています。";

    return item;
});


const ITEMS_PER_PAGE = 10;
const TABS = [
    { label: 'すべて', key: 'All', icon: Search, color: 'text-indigo-500' },
    { label: '作品', key: 'Work', icon: Book, color: 'text-sky-500' },
    { label: 'ユーザー', key: 'User', icon: User, color: 'text-teal-500' },
    { label: '価値観', key: 'Value', icon: Lightbulb, color: 'text-amber-500' },
    { label: 'スキル', key: 'Skill', icon: Settings, color: 'text-slate-500' },
    { label: 'リスト', key: 'List', icon: List, color: 'text-pink-500' },
    { label: 'チェーン', key: 'Chain', icon: Link, color: 'text-green-500' },
];


// --- Sub Components ---

// 1. Sidebar Placeholder
const Sidebar = ({ activeTab, onTabChange }) => (
    <div className="flex-shrink-0 w-64 p-4 space-y-2 bg-white border-r border-gray-100 hidden lg:block">
        <h2 className="text-lg font-bold text-gray-800 mb-4">カテゴリ</h2>
        {TABS.map(tab => (
            <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex items-center w-full p-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.key ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
            >
                <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.key ? tab.color : 'text-gray-400'}`} />
                {tab.label}
            </button>
        ))}
    </div>
);

// 2. Result Card Component
/**
 * @param {{result: SearchResult}} props
 */
const ResultCard = ({ result }) => {
    const tabInfo = TABS.find(t => t.key === result.type) || TABS[0];
    const Icon = tabInfo.icon;
    const typeLabel = tabInfo.label;
    const typeColor = tabInfo.color;

    const renderDetails = () => {
        switch (result.type) {
            case 'Work':
                /** @type {Work} */
                const work = result;
                return (
                    <>
                        <p className="text-xs text-gray-500 mt-1">カテゴリ: {work.category}</p>
                        <p className="text-xs text-gray-500">著者: {work.author}</p>
                        <p className="mt-2 text-sm text-gray-700 truncate">{work.description}</p>
                    </>
                );
            case 'User':
                /** @type {Profile} */
                const user = result;
                return (
                    <>
                        <p className="mt-1 text-sm text-gray-700 truncate">プロフィール: {user.profile}</p>
                        <p className="text-xs text-gray-500 mt-1">スキル: {user.skills.join(', ')}</p>
                    </>
                );
            case 'Value':
                /** @type {Value} */
                const value = result;
                return (
                    <>
                        <p className="text-xs text-gray-500 mt-1">カテゴリ: {value.category}</p>
                        <p className="mt-2 text-sm text-gray-700 italic truncate">質問: {value.question}</p>
                    </>
                );
            case 'Skill':
                /** @type {Skill} */
                const skill = result;
                return (
                    <>
                        <p className="mt-2 text-sm text-gray-700 truncate">概要: {skill.description}</p>
                    </>
                );
            case 'List':
                /** @type {List} */
                const list = result;
                return (
                    <>
                        <p className="text-xs text-gray-500 mt-1">作成者: {list.owner}</p>
                        <p className="mt-2 text-sm text-gray-700 truncate">説明: {list.description}</p>
                    </>
                );
            case 'Chain':
                /** @type {Chain} */
                const chain = result;
                return (
                    <>
                        <p className="text-xs text-gray-500 mt-1">ステップ数: {chain.steps}</p>
                        <p className="mt-2 text-sm text-gray-700 truncate">説明: {chain.description}</p>
                    </>
                );
            default:
                return null;
        }
    };

    // タイトルは、Work/Skill/List/Chainはtitle、User/Valueはnameを使用
    const title = result.title || result.name || (result.description ? result.description.substring(0, 30) + '...' : '詳細情報');

    // 詳細画面への遷移パスをシミュレート
    const navPath = `/${result.type.toLowerCase()}s/${result.id}`;

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mr-3 ${typeColor}`} />
                    <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight leading-snug">
                        {title}
                    </h3>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 ml-4 hidden sm:block`}>{typeLabel}</span>
            </div>

            <div className="mt-3 border-l-4 pl-4" style={{ borderColor: typeColor.replace('text-', '#').replace('-500', '500') }}>
                {renderDetails()}
            </div>

            <div className="mt-4 flex justify-end">
                <a href={navPath} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition duration-150 p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100">
                    詳細を見る &rarr;
                </a>
            </div>
        </div>
    );
};

// 3. Pagination Component
const Pagination = ({ totalItems, itemsPerPage, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const renderPages = useMemo(() => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            return pageNumbers;
        }

        pages.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage > 3) pages.push('...');

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
        }

        if (currentPage < totalPages - 2) pages.push('...');

        if (!pages.includes(totalPages)) pages.push(totalPages);

        return pages.filter((value, index, self) =>
            self.indexOf(value) === index || value === '...'
        ).sort((a, b) => {
            if (a === '...') return 1;
            if (b === '...') return -1;
            return a - b;
        });

    }, [totalPages, currentPage]);

    const PageButton = ({ page, isActive, isEllipsis }) => (
        <button
            onClick={() => onPageChange(page)}
            disabled={isEllipsis}
            className={`mx-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : isEllipsis
                    ? 'text-gray-500 cursor-default'
                    : 'text-gray-700 bg-white hover:bg-gray-100 hover:text-indigo-600 border border-gray-200'
                }`}
        >
            {page}
        </button>
    );

    return (
        <div className="flex justify-center items-center space-x-1 mt-8 mb-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                前へ
            </button>

            {renderPages.map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="text-gray-500 px-2">...</span>
                    ) : (
                        <PageButton page={page} isActive={page === currentPage} />
                    )}
                </React.Fragment>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                次へ
                <ArrowRight className="w-4 h-4 ml-1" />
            </button>
        </div>
    );
};

// --- Main Application Component ---
export default function App() {
    // --- State Management ---
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile sidebar

    // --- Filtering and Pagination Logic (ダミーデータに対する検索処理) ---

    // シンプルなキーワードフィルタリング（Supabase Full-Text Searchをシミュレート）
    const filteredResults = useMemo(() => {
        /** @type {SearchResult[]} */
        let results = ALL_MOCK_RESULTS;
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();

        // 1. Filter by Category Tab
        if (activeTab !== 'All') {
            results = results.filter(item => item.type === activeTab);
        }

        // 2. Filter by Search Term (Case-insensitive matching across relevant fields)
        if (normalizedSearchTerm) {
            results = results.filter(item => {
                const searchFields = [
                    item.title || item.name,
                    item.description,
                    item.category,
                    item.author,
                    item.question,
                    item.skills ? item.skills.join(' ') : null,
                    item.profile
                ].map(field => (field || '').toLowerCase());

                return searchFields.some(field => field.includes(normalizedSearchTerm));
            });
        }

        return results;
    }, [activeTab, searchTerm]);

    // Apply Pagination
    const paginatedResults = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredResults.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredResults, currentPage]);

    const totalResults = filteredResults.length;
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

    // Effect to reset page when filters change (Debounce Simulation)
    useEffect(() => {
        setCurrentPage(1);
        // リアルタイム検索のデバウンス処理（300ms遅延）をシミュレート
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [activeTab, searchTerm]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // 検索時にページをリセット
        setCurrentPage(1);
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const handlePageChange = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' }); // ページ遷移時にトップへスクロール
        }
    }, [totalPages]);

    // --- Placeholder Components for Layout Consistency ---
    const Header = () => (
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <div className="text-xl font-bold text-indigo-600">Static Search App</div>
                <div className="lg:hidden">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg text-gray-600 hover:bg-gray-100">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
                <div className="hidden lg:flex space-x-4">
                    <a href="/" className="text-gray-600 hover:text-indigo-600 font-medium">HOME</a>
                    <a href="/search" className="text-indigo-600 font-medium border-b-2 border-indigo-600">検索</a>
                    {/* Placeholder for user info/profile */}
                </div>
            </div>
        </header>
    );

    const Footer = () => (
        <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                &copy; 2024 Static App. All rights reserved. | ステータス: DB接続なし (静的データ)
            </div>
        </footer>
    );

    const MobileSidebar = () => (
        <div className={`fixed inset-0 z-20 bg-white transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden p-6`}>
            <div className="flex justify-end">
                <button onClick={() => setIsMenuOpen(false)} className="text-gray-600 hover:text-indigo-600 text-3xl">&times;</button>
            </div>
            {/* モバイルメニューでもSidebarコンポーネントを再利用 */}
            <Sidebar activeTab={activeTab} onTabChange={(key) => { handleTabChange(key); setIsMenuOpen(false); }} />
            <div className="mt-8 pt-4 border-t border-gray-200 space-y-2">
                <a href="/" className="block text-gray-600 hover:text-indigo-600 font-medium">HOME</a>
                <a href="/search" className="block text-indigo-600 font-medium">検索</a>
            </div>
        </div>
    );

    // --- Content Render Helpers ---

    const renderLoading = () => (
        <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-6 rounded-xl shadow-md">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-8 bg-indigo-100 rounded-lg w-24 float-right"></div>
                </div>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <div className="text-center py-16 bg-white rounded-xl shadow-md border border-gray-100 mt-6">
            <Search className="w-12 h-12 mx-auto text-indigo-400" />
            <h4 className="mt-4 text-xl font-semibold text-gray-900">
                検索結果が見つかりませんでした。
            </h4>
            <p className="mt-2 text-gray-500">
                別のキーワードやカテゴリでお試しください。
            </p>
        </div>
    );

    // --- Main Render ---

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <MobileSidebar />

            <main className="max-w-7xl mx-auto flex">
                {/* 1. Sidebar (PC/Tablet) */}
                <div className="hidden lg:block">
                    <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
                </div>

                {/* 2. Main Content Area */}
                <div className="flex-grow p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">統合検索 (静的デモ)</h1>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <input
                            type="text"
                            placeholder="🔍 キーワードを入力 (例: Supabase, Next.js, 佐藤)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') setCurrentPage(1); }}
                            className="w-full p-3 pl-12 text-lg border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition duration-150 shadow-md"
                            disabled={isLoading}
                        />
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-indigo-400" />
                    </div>

                    {/* Category Tabs (Horizontal Scroll on Mobile) */}
                    <div className="flex overflow-x-auto whitespace-nowrap space-x-2 pb-3 mb-6 border-b border-gray-200 sm:justify-start justify-center">
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => handleTabChange(tab.key)}
                                className={`
                                    px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 flex items-center
                                    ${activeTab === tab.key
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }
                                `}
                                disabled={isLoading}
                            >
                                <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.key ? 'text-white' : tab.color}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Results Display */}
                    <div className="mt-8">
                        {/* Result Header */}
                        <div className="flex justify-between items-center pb-2 border-b-2 border-indigo-400">
                            <h2 className="text-xl font-bold text-gray-800">
                                検索結果
                            </h2>
                            <span className="text-md font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full shadow-sm">
                                ({totalResults}件)
                            </span>
                        </div>

                        {/* Result List */}
                        {isLoading ? (
                            renderLoading()
                        ) : (
                            <div className="mt-6 space-y-6">
                                {totalResults === 0 ? (
                                    renderEmptyState()
                                ) : (
                                    <>
                                        {paginatedResults.map((result) => (
                                            <ResultCard key={result.id} result={result} />
                                        ))}
                                        <Pagination
                                            totalItems={totalResults}
                                            itemsPerPage={ITEMS_PER_PAGE}
                                            currentPage={currentPage}
                                            onPageChange={handlePageChange}
                                        />
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

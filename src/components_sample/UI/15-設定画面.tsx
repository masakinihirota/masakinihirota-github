"use client";

// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'supabase/auth';
// import { getsupabase, collection, doc, onSnapshot, initializesupabase } from 'supabase/supabase';
// import { initializeApp } from 'supabase/app';
// import { User, Lock, Eye, Link, CreditCard, ChevronDown, CheckCircle, XCircle, Trash2, Menu } from 'lucide-react';

// // --- supabase Initialization Boilerplate (Mandatory for Immersive Environment) ---
// // Note: In a real Next.js/Hono app, this logic would typically be split between client/server.
// // Here, it's included for environment compatibility and demonstrating data structure flow.

// const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
// const supabaseConfig = JSON.parse(typeof __supabase_config !== 'undefined' ? __supabase_config : '{}');
// const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : undefined;

// const usesupabase = () => {
//     const [isAuthReady, setIsAuthReady] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const [db, setDb] = useState(null);
//     const [auth, setAuth] = useState(null);

//     useEffect(() => {
//         if (Object.keys(supabaseConfig).length === 0) {
//             console.warn("supabase config is missing. Running in mock mode.");
//             setIsAuthReady(true);
//             setUserId('mock-user-id');
//             return;
//         }

//         try {
//             const app = initializeApp(supabaseConfig);
//             const supabase = getsupabase(app);
//             const userAuth = getAuth(app);

//             setDb(supabase);
//             setAuth(userAuth);

//             const handleAuth = async () => {
//                 if (initialAuthToken) {
//                     await signInWithCustomToken(userAuth, initialAuthToken).catch(e => console.error("Custom token sign-in failed:", e));
//                 } else {
//                     await signInAnonymously(userAuth).catch(e => console.error("Anonymous sign-in failed:", e));
//                 }
//             };

//             handleAuth();

//             const unsubscribe = onAuthStateChanged(userAuth, (user) => {
//                 setUserId(user ? user.uid : null);
//                 setIsAuthReady(true);
//                 console.log("supabase Auth State Changed. User ID:", user ? user.uid : 'Logged out');
//             });

//             return () => unsubscribe();
//         } catch (e) {
//             console.error("supabase initialization failed:", e);
//             setIsAuthReady(true); // Proceed to mock mode if init fails
//         }
//     }, []);

//     return { db, userId, isAuthReady };
// };

// // --- Mock Data & Data Schema ---

// const MOCK_SETTINGS_DATA = {
//     email: 'user@example.com',
//     displayName: 'ユーザーA',
//     language: '日本語',
//     timezone: 'Asia/Tokyo',
//     profilePublic: true,
//     worksPublic: false,
//     valuesPublic: true,
//     skillsPublic: true,
//     twoFactorEnabled: false,
//     googleLinked: true,
//     githubLinked: false,
//     currentPlan: '無料プラン',
//     paymentMethod: '**** **** **** 1234',
// };

// const languages = ['日本語', 'English', '中文'];
// const timezones = ['Asia/Tokyo', 'America/Los_Angeles', 'Europe/London'];

// // --- Utility Components ---

// const LoadingSpinner = () => (
//     <div className="flex justify-center items-center h-full p-8">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//         <p className="ml-3 text-gray-600">認証情報を確認中...</p>
//     </div>
// );

// const SectionTitle = ({ title }) => (
//     <div className="py-4 border-b border-gray-200 mb-6">
//         <h2 className="text-xl font-bold text-gray-800">{title}</h2>
//     </div>
// );

// const FormRow = ({ label, children }) => (
//     <div className="mb-6 pb-4 border-b border-gray-100 last:border-b-0">
//         <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
//         <div className="flex items-center space-x-4">
//             {children}
//         </div>
//     </div>
// );

// const PrimaryButton = ({ children, onClick, disabled = false, isDanger = false }) => (
//     <button
//         onClick={onClick}
//         disabled={disabled}
//         className={`
//       px-6 py-2 rounded-lg text-white font-semibold transition duration-150 ease-in-out
//       shadow-md hover:shadow-lg focus:outline-none focus:ring-4
//       ${isDanger
//                 ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
//                 : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
//             }
//       ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
//     `}
//     >
//         {children}
//     </button>
// );

// const SecondaryButton = ({ children, onClick }) => (
//     <button
//         onClick={onClick}
//         className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150 ease-in-out"
//     >
//         {children}
//     </button>
// );

// const AlertMessage = ({ message, type }) => {
//     const baseClasses = "p-4 mb-4 rounded-lg flex items-center shadow-md";
//     const colorClasses = type === 'success'
//         ? "bg-green-100 border border-green-400 text-green-700"
//         : "bg-red-100 border border-red-400 text-red-700";
//     const Icon = type === 'success' ? CheckCircle : XCircle;

//     return (
//         <div className={`${baseClasses} ${colorClasses}`} role="alert">
//             <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
//             <span>{message}</span>
//         </div>
//     );
// };

// // --- Tab Content Components ---

// const AccountSettings = ({ settings, setSettings, onSave }) => {
//     const [isSaving, setIsSaving] = useState(false);

//     const handleSave = () => {
//         setIsSaving(true);
//         // Simulate API call delay
//         setTimeout(() => {
//             onSave("アカウント");
//             setIsSaving(false);
//         }, 1000);
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
//             <SectionTitle title="アカウント設定" />

//             <FormRow label="メールアドレス">
//                 <div className="w-full sm:w-80 p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-hidden truncate">
//                     {settings.email}
//                 </div>
//                 <SecondaryButton onClick={() => console.log('メールアドレス変更モーダル表示')}>変更</SecondaryButton>
//             </FormRow>

//             <FormRow label="表示名">
//                 <input
//                     type="text"
//                     value={settings.displayName}
//                     onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
//                     className="w-full sm:w-80 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
//                 />
//                 <SecondaryButton onClick={() => console.log('表示名変更モーダル表示')}>変更</SecondaryButton>
//             </FormRow>

//             <FormRow label="言語">
//                 <div className="relative w-full sm:w-80">
//                     <select
//                         value={settings.language}
//                         onChange={(e) => setSettings({ ...settings, language: e.target.value })}
//                         className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
//                     >
//                         {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <ChevronDown className="w-4 h-4" />
//                     </div>
//                 </div>
//             </FormRow>

//             <FormRow label="タイムゾーン">
//                 <div className="relative w-full sm:w-80">
//                     <select
//                         value={settings.timezone}
//                         onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
//                         className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
//                     >
//                         {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
//                     </select>
//                     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                         <ChevronDown className="w-4 h-4" />
//                     </div>
//                 </div>
//             </FormRow>

//             <div className="pt-6">
//                 <PrimaryButton onClick={handleSave} disabled={isSaving}>
//                     {isSaving ? '保存中...' : '保存する'}
//                 </PrimaryButton>
//             </div>
//         </div>
//     );
// };

// const PrivacySettings = ({ settings, setSettings, onSave }) => {
//     const [isSaving, setIsSaving] = useState(false);

//     const handleRadioChange = (key, value) => setSettings({ ...settings, [key]: value });

//     const handleSave = () => {
//         setIsSaving(true);
//         setTimeout(() => {
//             onSave("プライバシー");
//             setIsSaving(false);
//         }, 1000);
//     };

//     const privacyOptions = [
//         { key: 'profilePublic', label: 'プロフィールの公開' },
//         { key: 'worksPublic', label: '作品リストの公開' },
//         { key: 'valuesPublic', label: '価値観の公開' },
//         { key: 'skillsPublic', label: 'スキルの公開' },
//     ];

//     return (
//         <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
//             <SectionTitle title="プライバシー設定" />

//             {privacyOptions.map(({ key, label }) => (
//                 <FormRow key={key} label={label}>
//                     <div className="flex space-x-6">
//                         <label className="inline-flex items-center">
//                             <input
//                                 type="radio"
//                                 className="form-radio text-indigo-600 h-5 w-5"
//                                 name={key}
//                                 checked={settings[key] === true}
//                                 onChange={() => handleRadioChange(key, true)}
//                             />
//                             <span className="ml-2 text-gray-700">公開</span>
//                         </label>
//                         <label className="inline-flex items-center">
//                             <input
//                                 type="radio"
//                                 className="form-radio text-indigo-600 h-5 w-5"
//                                 name={key}
//                                 checked={settings[key] === false}
//                                 onChange={() => handleRadioChange(key, false)}
//                             />
//                             <span className="ml-2 text-gray-700">非公開</span>
//                         </label>
//                     </div>
//                 </FormRow>
//             ))}

//             <div className="pt-6">
//                 <PrimaryButton onClick={handleSave} disabled={isSaving}>
//                     {isSaving ? '保存中...' : '保存する'}
//                 </PrimaryButton>
//             </div>
//         </div>
//     );
// };

// const SecuritySettings = ({ settings, setSettings, isAuthReady }) => {
//     const handleCheckboxChange = (key, value) => setSettings({ ...settings, [key]: value });

//     return (
//         <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
//             <SectionTitle title="セキュリティ設定" />

//             <FormRow label="パスワード変更">
//                 <PrimaryButton onClick={() => console.log('パスワード変更モーダル表示')}>
//                     パスワードを変更する
//                 </PrimaryButton>
//             </FormRow>

//             <FormRow label="二要素認証">
//                 <label className="inline-flex items-center space-x-3 cursor-pointer">
//                     <input
//                         type="checkbox"
//                         checked={settings.twoFactorEnabled}
//                         onChange={(e) => handleCheckboxChange('twoFactorEnabled', e.target.checked)}
//                         className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
//                     />
//                     <span className="text-gray-700">有効にする</span>
//                 </label>
//             </FormRow>

//             <FormRow label="ログイン履歴">
//                 <SecondaryButton onClick={() => console.log('ログイン履歴画面へ遷移: /settings/login-history')}>
//                     ログイン履歴を見る
//                 </SecondaryButton>
//             </FormRow>

//             <FormRow label="アカウント削除">
//                 <DeleteAccountButton isAuthReady={isAuthReady} />
//             </FormRow>
//         </div>
//     );
// };

// const DeleteAccountButton = ({ isAuthReady }) => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isDeleting, setIsDeleting] = useState(false);

//     const handleDelete = () => {
//         setIsDeleting(true);
//         // 実際のSupabase/Drizzle処理をシミュレート
//         setTimeout(() => {
//             console.log('アカウント削除処理を実行...');
//             // 成功または失敗のフィードバック
//             setIsModalOpen(false);
//             setIsDeleting(false);
//             // ログアウト処理...
//         }, 2000);
//     };

//     const Modal = () => (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}>
//             <div
//                 className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-4"
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <h3 className="text-xl font-bold text-gray-800 mb-4">アカウントを削除しますか?</h3>
//                 <p className="text-gray-600 mb-6">この操作は取り消せません。全ての設定、データ、作品が完全に削除されます。</p>
//                 <div className="flex justify-end space-x-3">
//                     <SecondaryButton onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
//                         キャンセル
//                     </SecondaryButton>
//                     <PrimaryButton
//                         onClick={handleDelete}
//                         isDanger={true}
//                         disabled={isDeleting}
//                     >
//                         {isDeleting ? '削除中...' : '削除する'}
//                     </PrimaryButton>
//                 </div>
//             </div>
//         </div>
//     );

//     return (
//         <>
//             <PrimaryButton onClick={() => isAuthReady && setIsModalOpen(true)} isDanger={true} disabled={!isAuthReady}>
//                 <Trash2 className="w-5 h-5 inline-block mr-2" />
//                 アカウントを削除する
//             </PrimaryButton>
//             {isModalOpen && <Modal />}
//         </>
//     );
// };

// const LinkedServices = ({ settings, setSettings }) => {
//     const services = [
//         { name: 'Google', key: 'googleLinked', icon: 'https://placehold.co/20x20/F44336/ffffff?text=G' },
//         { name: 'GitHub', key: 'githubLinked', icon: 'https://placehold.co/20x20/24292F/ffffff?text=Gh' },
//     ];

//     const handleLinkToggle = (key) => {
//         // 実際のOAuth/Supabase Auth連携処理をシミュレート
//         console.log(`${key} の連携状態を切り替え: ${settings[key] ? '解除' : '連携'}`);
//         setSettings(prev => ({ ...prev, [key]: !prev[key] }));
//     };

//     return (
//         <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
//             <SectionTitle title="連携サービス" />

//             {services.map(service => (
//                 <FormRow key={service.name} label={service.name}>
//                     <div className="flex items-center w-full justify-between">
//                         <div className="flex items-center space-x-3">
//                             <img src={service.icon} alt={`${service.name} Icon`} className="w-5 h-5 rounded-full" />
//                             <span className={`font-semibold ${settings[service.key] ? 'text-green-600' : 'text-red-600'}`}>
//                                 {settings[service.key] ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <XCircle className="w-4 h-4 inline mr-1" />}
//                                 {settings[service.key] ? '連携済み' : '未連携'}
//                             </span>
//                         </div>
//                         <PrimaryButton
//                             onClick={() => handleLinkToggle(service.key)}
//                             isDanger={settings[service.key]}
//                         >
//                             {settings[service.key] ? '解除する' : '連携する'}
//                         </PrimaryButton>
//                     </div>
//                 </FormRow>
//             ))}
//         </div>
//     );
// };

// const PaymentSettings = ({ settings }) => {
//     return (
//         <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
//             <SectionTitle title="支払い設定" />

//             <FormRow label="現在のプラン">
//                 <div className="flex items-center w-full justify-between">
//                     <span className="text-lg font-bold text-gray-800">{settings.currentPlan}</span>
//                     <PrimaryButton onClick={() => console.log('プラン選択画面へ遷移: /settings/plans')}>
//                         プランをアップグレード
//                     </PrimaryButton>
//                 </div>
//             </FormRow>

//             <FormRow label="支払い方法">
//                 <div className="flex items-center w-full justify-between">
//                     <div className="text-gray-700">クレジットカード: <span className="font-mono text-base">{settings.paymentMethod}</span></div>
//                     <SecondaryButton onClick={() => console.log('支払い方法変更画面へ遷移: /settings/payment-methods')}>
//                         支払い方法を変更する
//                     </SecondaryButton>
//                 </div>
//             </FormRow>

//             <FormRow label="支払い履歴">
//                 <SecondaryButton onClick={() => console.log('支払い履歴画面へ遷移: /settings/payment-history')}>
//                     支払い履歴を見る
//                 </SecondaryButton>
//             </FormRow>
//         </div>
//     );
// };

// // --- Main App Component ---

// const Sidebar = ({ activeTab, onSelectTab }) => {
//     const tabs = [
//         { id: 'account', label: '設定', icon: User },
//         // Only '設定' is active in the spec's sidebar.
//         // In a real app, this would be a list of main navigation links.
//     ];

//     return (
//         <div className="p-4 bg-white border-r border-gray-200 h-full hidden lg:block">
//             <h3 className="text-lg font-semibold mb-6 text-gray-900">メニュー</h3>
//             <ul>
//                 {tabs.map(tab => {
//                     const Icon = tab.icon;
//                     const isActive = tab.id === 'account'; // '設定' is active in the spec
//                     return (
//                         <li key={tab.id} className="mb-2">
//                             <a
//                                 href="#"
//                                 onClick={(e) => e.preventDefault()}
//                                 className={`flex items-center p-3 rounded-lg transition duration-150 ${isActive ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
//                                     }`}
//                             >
//                                 <Icon className="w-5 h-5 mr-3" />
//                                 {tab.label}
//                             </a>
//                         </li>
//                     );
//                 })}
//             </ul>
//         </div>
//     );
// };

// const Header = ({ onMenuClick }) => (
//     <header className="sticky top-0 z-40 bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
//             <h1 className="text-2xl font-extrabold text-indigo-600">App Logo (Next.js 15)</h1>
//             <div className="flex items-center space-x-4">
//                 <span className="text-gray-600 hidden sm:block">HOME画面と共通のヘッダー要素</span>
//                 <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
//                     <Menu className="w-6 h-6" />
//                 </button>
//             </div>
//         </div>
//     </header>
// );

// const Footer = () => (
//     <footer className="mt-8 border-t border-gray-200 py-4 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
//             フッターエリア (HOME画面と共通) - &copy; 2024 All Rights Reserved.
//         </div>
//     </footer>
// );

// const CategoryTabs = ({ activeTab, onSelectTab }) => {
//     const tabs = [
//         { id: 'account', label: 'アカウント', icon: User },
//         { id: 'privacy', label: 'プライバシー', icon: Eye },
//         { id: 'security', label: 'セキュリティ', icon: Lock },
//         { id: 'linked', label: '連携サービス', icon: Link },
//         { id: 'payment', label: '支払い', icon: CreditCard },
//     ];

//     return (
//         <div className="mb-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap scroll-smooth">
//             <div className="flex space-x-2 sm:space-x-4 px-4 sm:px-0">
//                 {tabs.map(tab => {
//                     const isActive = activeTab === tab.id;
//                     const Icon = tab.icon;
//                     return (
//                         <button
//                             key={tab.id}
//                             onClick={() => onSelectTab(tab.id)}
//                             className={`
//                 flex items-center py-2 px-3 sm:px-4 text-sm font-medium transition duration-150
//                 ${isActive
//                                     ? 'border-b-4 border-indigo-600 text-indigo-600'
//                                     : 'border-b-4 border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-100'
//                                 }
//                 whitespace-nowrap
//               `}
//                         >
//                             <Icon className="w-4 h-4 mr-1 sm:mr-2" />
//                             {tab.label}
//                         </button>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// };


// export default function App() {
//     const { db, userId, isAuthReady } = usesupabase();
//     const [activeTab, setActiveTab] = useState('account');
//     const [settings, setSettings] = useState(MOCK_SETTINGS_DATA);
//     const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

//     // Simulate data fetching and updating from supabase/Supabase (using mock data)
//     useEffect(() => {
//         if (isAuthReady && userId) {
//             // In a real app, this would sync with supabase using onSnapshot
//             console.log(`Fetching settings for user: ${userId}`);
//             // Simulate loading real data
//             // const docRef = doc(db, `artifacts/${appId}/users/${userId}/user_settings`, 'config');
//             // const unsubscribe = onSnapshot(docRef, (docSnap) => { ... });

//             // For this UI, we just use the mock data structure
//         }
//     }, [isAuthReady, userId, db]);

//     const handleSaveSuccess = (tabName) => {
//         setMessage({ type: 'success', text: `✅ ${tabName}設定を保存しました!` });
//         setTimeout(() => setMessage(null), 3000);
//     };

//     const CurrentTabContent = useMemo(() => {
//         const commonProps = { settings, setSettings, onSave: handleSaveSuccess, isAuthReady };

//         switch (activeTab) {
//             case 'account':
//                 return <AccountSettings {...commonProps} />;
//             case 'privacy':
//                 return <PrivacySettings {...commonProps} />;
//             case 'security':
//                 return <SecuritySettings {...commonProps} />;
//             case 'linked':
//                 return <LinkedServices {...commonProps} />;
//             case 'payment':
//                 return <PaymentSettings {...commonProps} />;
//             default:
//                 return <AccountSettings {...commonProps} />;
//         }
//     }, [activeTab, settings, isAuthReady]);

//     if (!isAuthReady) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <LoadingSpinner />
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 flex flex-col">
//             <Header onMenuClick={() => console.log("Hamburger Menu Clicked")} />

//             <main className="flex-grow max-w-7xl mx-auto w-full flex">
//                 {/* Sidebar for PC/Tablet */}
//                 <div className="hidden lg:block w-64 flex-shrink-0">
//                     <Sidebar activeTab="settings" onSelectTab={setActiveTab} />
//                 </div>

//                 {/* Main Content Area */}
//                 <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
//                     <h1 className="text-3xl font-extrabold text-gray-900 mb-6">設定</h1>

//                     {/* Notification Area */}
//                     <div className="fixed top-20 right-4 z-50">
//                         {message && <AlertMessage message={message.text} type={message.type} />}
//                     </div>

//                     {/* Category Tabs (Responsive Horizontal Scroll on Mobile) */}
//                     <CategoryTabs activeTab={activeTab} onSelectTab={setActiveTab} />

//                     {/* Settings Content (Responsive Max Width) */}
//                     <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
//                         {CurrentTabContent}
//                     </div>
//                 </div>
//             </main>

//             <Footer />
//         </div>
//     );
// }
import React, { useState, useMemo } from 'react';
import { User, Lock, Eye, Link, CreditCard, ChevronDown, CheckCircle, XCircle, Trash2, Menu } from 'lucide-react';

// --- ダミーデータ（Supabase user_settings テーブルを想定） ---
const MOCK_USER_ID = 'auth-user-12345'; // ダミーのユーザーID
const MOCK_SETTINGS_DATA = {
    // アカウント設定
    user_id: MOCK_USER_ID,
    email: 'user@example.com',
    display_name: 'ユーザーA',
    language: '日本語',
    timezone: 'Asia/Tokyo',

    // プライバシー設定
    profile_public: true,
    works_public: false,
    values_public: true,
    skills_public: true,

    // セキュリティ設定
    two_factor_enabled: false,

    // 連携サービス (設定データとは別に管理をシミュレート)
    google_linked: true,
    github_linked: false,

    // 支払い設定 (設定データとは別に管理をシミュレート)
    current_plan: '無料プラン',
    payment_method_last_four: '1234',
};

const languages = ['日本語', 'English', '中文'];
const timezones = ['Asia/Tokyo', 'America/Los_Angeles', 'Europe/London'];

// --- Utility Components ---

const SectionTitle = ({ title }) => (
    <div className="py-4 border-b border-gray-200 mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
);

const FormRow = ({ label, children }) => (
    <div className="mb-6 pb-4 border-b border-gray-100 last:border-b-0">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="flex items-center space-x-4 flex-wrap">
            {children}
        </div>
    </div>
);

const PrimaryButton = ({ children, onClick, disabled = false, isDanger = false, type = 'button' }) => (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`
      px-6 py-2 rounded-lg text-white font-semibold transition duration-150 ease-in-out
      shadow-md hover:shadow-lg focus:outline-none focus:ring-4 text-sm whitespace-nowrap
      ${isDanger
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300'
            }
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `}
    >
        {children}
    </button>
);

const SecondaryButton = ({ children, onClick }) => (
    <button
        onClick={onClick}
        className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-150 ease-in-out whitespace-nowrap"
    >
        {children}
    </button>
);

const AlertMessage = ({ message, type }) => {
    const baseClasses = "p-4 mb-4 rounded-lg flex items-center shadow-md";
    const colorClasses = type === 'success'
        ? "bg-green-100 border border-green-400 text-green-700"
        : "bg-red-100 border border-red-400 text-red-700";
    const Icon = type === 'success' ? CheckCircle : XCircle;

    return (
        <div className={`${baseClasses} ${colorClasses}`} role="alert">
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{message}</span>
        </div>
    );
};

// --- Tab Content Components ---

const AccountSettings = ({ settings, setSettings, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Supabase RLSを想定した更新処理をシミュレート
        setTimeout(() => {
            onSave("アカウント");
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <SectionTitle title="アカウント設定" />

            <FormRow label="メールアドレス">
                <div className="w-full sm:w-80 p-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm overflow-hidden truncate">
                    {settings.email}
                </div>
                <SecondaryButton onClick={() => console.log('メールアドレス変更モーダル表示')}>変更</SecondaryButton>
            </FormRow>

            <FormRow label="表示名">
                <input
                    type="text"
                    value={settings.display_name}
                    onChange={(e) => setSettings({ ...settings, display_name: e.target.value })}
                    className="w-full sm:w-80 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <SecondaryButton onClick={() => console.log('表示名変更モーダル表示')}>変更</SecondaryButton>
            </FormRow>

            <FormRow label="言語">
                <div className="relative w-full sm:w-80">
                    <select
                        value={settings.language}
                        onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                    >
                        {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </FormRow>

            <FormRow label="タイムゾーン">
                <div className="relative w-full sm:w-80">
                    <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-indigo-500"
                    >
                        {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </FormRow>

            <div className="pt-6">
                <PrimaryButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? '保存中...' : '保存する'}
                </PrimaryButton>
            </div>
        </div>
    );
};

const PrivacySettings = ({ settings, setSettings, onSave }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleRadioChange = (key, value) => setSettings({ ...settings, [key]: value });

    const handleSave = () => {
        setIsSaving(true);
        // Supabase RLSを想定した更新処理をシミュレート
        setTimeout(() => {
            onSave("プライバシー");
            setIsSaving(false);
        }, 1000);
    };

    const privacyOptions = [
        { key: 'profile_public', label: 'プロフィールの公開' },
        { key: 'works_public', label: '作品リストの公開' },
        { key: 'values_public', label: '価値観の公開' },
        { key: 'skills_public', label: 'スキルの公開' },
    ];

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <SectionTitle title="プライバシー設定" />

            {privacyOptions.map(({ key, label }) => (
                <FormRow key={key} label={label}>
                    <div className="flex space-x-6">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600 h-5 w-5"
                                name={key}
                                checked={settings[key] === true}
                                onChange={() => handleRadioChange(key, true)}
                            />
                            <span className="ml-2 text-gray-700">公開</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                className="form-radio text-indigo-600 h-5 w-5"
                                name={key}
                                checked={settings[key] === false}
                                onChange={() => handleRadioChange(key, false)}
                            />
                            <span className="ml-2 text-gray-700">非公開</span>
                        </label>
                    </div>
                </FormRow>
            ))}

            <div className="pt-6">
                <PrimaryButton onClick={handleSave} disabled={isSaving}>
                    {isSaving ? '保存中...' : '保存する'}
                </PrimaryButton>
            </div>
        </div>
    );
};

const SecuritySettings = ({ settings, setSettings }) => {
    const handleCheckboxChange = (key, value) => setSettings({ ...settings, [key]: value });

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <SectionTitle title="セキュリティ設定" />

            <FormRow label="パスワード変更">
                <PrimaryButton onClick={() => console.log('パスワード変更モーダル表示')}>
                    パスワードを変更する
                </PrimaryButton>
            </FormRow>

            <FormRow label="二要素認証">
                <label className="inline-flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.two_factor_enabled}
                        onChange={(e) => handleCheckboxChange('two_factor_enabled', e.target.checked)}
                        className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-gray-700">有効にする (変更は保存時に反映されます)</span>
                </label>
            </FormRow>

            <FormRow label="ログイン履歴">
                <SecondaryButton onClick={() => console.log('ログイン履歴画面へ遷移: /settings/login-history')}>
                    ログイン履歴を見る
                </SecondaryButton>
            </FormRow>

            <FormRow label="アカウント削除">
                <DeleteAccountButton />
            </FormRow>
        </div>
    );
};

const DeleteAccountButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = () => {
        setIsDeleting(true);
        // Supabase AuthのdeleteUserを想定した削除処理をシミュレート
        setTimeout(() => {
            console.log('アカウント削除処理を実行 (Supabase Auth想定)...');
            // ログアウト処理...
            setIsModalOpen(false);
            setIsDeleting(false);
        }, 2000);
    };

    const Modal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setIsModalOpen(false)}>
            <div
                className="bg-white p-8 rounded-xl shadow-2xl max-w-sm mx-4 w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-bold text-gray-800 mb-4">アカウントを削除しますか?</h3>
                <p className="text-gray-600 mb-6 text-sm">この操作は取り消せません。全ての設定、データ、作品が完全に削除されます。</p>
                <div className="flex justify-end space-x-3">
                    <SecondaryButton onClick={() => setIsModalOpen(false)} disabled={isDeleting}>
                        キャンセル
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={handleDelete}
                        isDanger={true}
                        disabled={isDeleting}
                    >
                        {isDeleting ? '削除中...' : '削除する'}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <PrimaryButton onClick={() => setIsModalOpen(true)} isDanger={true}>
                <Trash2 className="w-5 h-5 inline-block mr-2" />
                アカウントを削除する
            </PrimaryButton>
            {isModalOpen && <Modal />}
        </>
    );
};

const LinkedServices = ({ settings, setSettings, onLinkToggle }) => {
    const services = [
        { name: 'Google', key: 'google_linked', icon: 'https://placehold.co/20x20/F44336/ffffff?text=G' },
        { name: 'GitHub', key: 'github_linked', icon: 'https://placehold.co/20x20/24292F/ffffff?text=Gh' },
    ];

    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <SectionTitle title="連携サービス" />

            {services.map(service => (
                <FormRow key={service.name} label={service.name}>
                    <div className="flex items-center w-full justify-between">
                        <div className="flex items-center space-x-3">
                            <img src={service.icon} alt={`${service.name} Icon`} className="w-5 h-5 rounded-full" />
                            <span className={`font-semibold text-sm flex items-center ${settings[service.key] ? 'text-green-600' : 'text-red-600'}`}>
                                {settings[service.key] ? <CheckCircle className="w-4 h-4 inline mr-1" /> : <XCircle className="w-4 h-4 inline mr-1" />}
                                {settings[service.key] ? '連携済み' : '未連携'}
                            </span>
                        </div>
                        <PrimaryButton
                            onClick={() => onLinkToggle(service.key)}
                            isDanger={settings[service.key]}
                        >
                            {settings[service.key] ? '解除する' : '連携する (OAuth)'}
                        </PrimaryButton>
                    </div>
                </FormRow>
            ))}
        </div>
    );
};

const PaymentSettings = ({ settings }) => {
    return (
        <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
            <SectionTitle title="支払い設定" />

            <FormRow label="現在のプラン">
                <div className="flex items-center w-full justify-between">
                    <span className="text-lg font-bold text-gray-800">{settings.current_plan}</span>
                    <PrimaryButton onClick={() => console.log('プラン選択画面へ遷移: /settings/plans')}>
                        プランをアップグレード
                    </PrimaryButton>
                </div>
            </FormRow>

            <FormRow label="支払い方法">
                <div className="flex items-center w-full justify-between">
                    <div className="text-gray-700">クレジットカード: <span className="font-mono text-base">**** **** **** {settings.payment_method_last_four}</span></div>
                    <SecondaryButton onClick={() => console.log('支払い方法変更画面へ遷移: /settings/payment-methods')}>
                        支払い方法を変更する
                    </SecondaryButton>
                </div>
            </FormRow>

            <FormRow label="支払い履歴">
                <SecondaryButton onClick={() => console.log('支払い履歴画面へ遷移: /settings/payment-history')}>
                    支払い履歴を見る
                </SecondaryButton>
            </FormRow>
        </div>
    );
};

// --- Layout & Main App Component ---

const Sidebar = () => (
    <div className="p-4 bg-white border-r border-gray-200 h-full hidden lg:block">
        <h3 className="text-lg font-semibold mb-6 text-gray-900">ナビゲーション</h3>
        <ul>
            <li className="mb-2">
                <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center p-3 rounded-lg bg-indigo-50 text-indigo-700 font-semibold transition duration-150"
                >
                    <User className="w-5 h-5 mr-3" />
                    設定
                </a>
            </li>
            <li className="mb-2">
                <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition duration-150"
                >
                    <Menu className="w-5 h-5 mr-3" />
                    HOME
                </a>
            </li>
        </ul>
    </div>
);

const Header = ({ onMenuClick }) => (
    <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-indigo-600">Next App</h1>
            <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm hidden sm:block">認証済みユーザー: {MOCK_USER_ID.substring(0, 8)}...</span>
                <button onClick={onMenuClick} className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </div>
    </header>
);

const Footer = () => (
    <footer className="mt-8 border-t border-gray-200 py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-gray-500">
            フッターエリア (HOME画面と共通) - &copy; 2024 Next.js 15 Supabase
        </div>
    </footer>
);

const CategoryTabs = ({ activeTab, onSelectTab }) => {
    const tabs = [
        { id: 'account', label: 'アカウント', icon: User },
        { id: 'privacy', label: 'プライバシー', icon: Eye },
        { id: 'security', label: 'セキュリティ', icon: Lock },
        { id: 'linked', label: '連携サービス', icon: Link },
        { id: 'payment', label: '支払い', icon: CreditCard },
    ];

    return (
        // 横スクロールを可能にするコンテナ
        <div className="mb-6 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
            <div className="flex space-x-2 sm:space-x-4 px-4 sm:px-0">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onSelectTab(tab.id)}
                            className={`
                flex items-center py-2 px-3 sm:px-4 text-sm font-medium transition duration-150
                ${isActive
                                    ? 'border-b-4 border-indigo-600 text-indigo-600'
                                    : 'border-b-4 border-transparent text-gray-600 hover:text-indigo-600 hover:border-indigo-100'
                                }
                whitespace-nowrap
              `}
                        >
                            <Icon className="w-4 h-4 mr-1 sm:mr-2" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


export default function App() {
    // 初期設定データを状態として管理
    const [settings, setSettings] = useState(MOCK_SETTINGS_DATA);
    const [activeTab, setActiveTab] = useState('account');
    const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

    const handleSaveSuccess = (tabName) => {
        setMessage({ type: 'success', text: `✅ ${tabName}設定を保存しました! (ダミー保存)` });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleLinkToggle = (key) => {
        // 連携状態の切り替えをシミュレート
        const isLinking = !settings[key];
        setSettings(prev => ({ ...prev, [key]: isLinking }));

        // 成功メッセージのシミュレート
        const serviceName = key === 'google_linked' ? 'Google' : 'GitHub';
        setMessage({
            type: 'success',
            text: isLinking
                ? `✅ ${serviceName}と連携しました! (OAuthシミュレーション)`
                : `✅ ${serviceName}の連携を解除しました! (ダミー解除)`
        });
        setTimeout(() => setMessage(null), 3000);
    }

    const CurrentTabContent = useMemo(() => {
        const commonProps = { settings, setSettings, onSave: handleSaveSuccess };

        switch (activeTab) {
            case 'account':
                return <AccountSettings {...commonProps} />;
            case 'privacy':
                return <PrivacySettings {...commonProps} />;
            case 'security':
                return <SecuritySettings {...commonProps} />;
            case 'linked':
                return <LinkedServices {...commonProps} onLinkToggle={handleLinkToggle} />;
            case 'payment':
                return <PaymentSettings {...commonProps} />;
            default:
                return <AccountSettings {...commonProps} />;
        }
    }, [activeTab, settings]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-[Inter]">
            <Header onMenuClick={() => console.log("Hamburger Menu Clicked (Mobile Nav)")} />

            <main className="flex-grow max-w-7xl mx-auto w-full flex">
                {/* Sidebar (PC/Tablet) */}
                <div className="hidden lg:block w-64 flex-shrink-0">
                    <Sidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <div className="p-4 sm:p-6 lg:p-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">設定</h1>

                        {/* Notification Area (Fixed Position) */}
                        <div className="fixed top-20 right-4 z-50 w-full max-w-sm">
                            {message && <AlertMessage message={message.text} type={message.type} />}
                        </div>

                        {/* Category Tabs (Responsive) */}
                        <CategoryTabs activeTab={activeTab} onSelectTab={setActiveTab} />

                        {/* Settings Content (Max Width specified for PC/Tablet layout) */}
                        <div className="max-w-full md:max-w-3xl lg:max-w-4xl mx-auto">
                            {CurrentTabContent}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

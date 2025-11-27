"use client";
import React, { useState } from 'react';
import { ChevronLeft, AlertCircle, Github } from 'lucide-react';

// Googleのカラーアイコンコンポーネント
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ログイン処理のシミュレーション
  const handleLogin = async (provider) => {
    setIsLoading(true);
    setError(null);

    // ネットワーク遅延のシミュレーション
    setTimeout(() => {
      // 成功率80%のシミュレーション
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        alert(`${provider}でのログイン処理：成功\nHOME画面へ遷移します`);
      } else {
        setError("ログインに失敗しました。もう一度お試しください。");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-800">

      {/* --- ヘッダーエリア --- */}
      <header className="w-full p-4 md:p-6 flex items-center relative">
        <button
          onClick={() => alert('トップページへ戻ります')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group text-sm md:text-base absolute left-4 md:left-8 top-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          トップに戻る
        </button>
      </header>

      {/* --- メインコンテンツエリア --- */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pb-12 w-full">

        {/* ロゴエリア */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg mb-4">
            <span className="text-white font-bold text-2xl tracking-tighter">VNS</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-wide">VNS masakinihirota</h1>
        </div>

        {/* ログインカードコンテナ */}
        <div className="w-full max-w-[320px] md:max-w-[400px] flex flex-col items-center">

          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">ログイン</h2>

          {/* エラーメッセージ表示 */}
          {error && (
            <div className="w-full mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700">エラーが発生しました</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* --- OAuthボタンエリア --- */}
          <div className="w-full space-y-4">

            {/* Google ログインボタン */}
            <button
              onClick={() => handleLogin('Google')}
              disabled={isLoading}
              className={`
                w-full h-[56px] flex items-center justify-center gap-3
                bg-white border border-gray-300 rounded-lg shadow-sm
                text-gray-700 font-medium text-base transition-all duration-200
                hover:bg-gray-50 hover:shadow-md hover:border-gray-400
                active:scale-[0.99]
                ${isLoading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin" />
              ) : (
                <>
                  <GoogleIcon />
                  Google でログイン
                </>
              )}
            </button>

            {/* GitHub ログインボタン */}
            <button
              onClick={() => handleLogin('GitHub')}
              disabled={isLoading}
              className={`
                w-full h-[56px] flex items-center justify-center gap-3
                bg-[#24292e] border border-[#24292e] rounded-lg shadow-sm
                text-white font-medium text-base transition-all duration-200
                hover:bg-[#24292e]/90 hover:shadow-md
                active:scale-[0.99]
                ${isLoading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  GitHub でログイン
                </>
              )}
            </button>
          </div>

          {/* --- 区切り線と新規登録 --- */}
          <div className="w-full mt-8 md:mt-10 mb-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 text-gray-500">または</span>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-2">まだアカウントをお持ちでない方</p>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('新規登録画面へ遷移します'); }}
              className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline transition-colors"
            >
              新規会員登録はこちら
            </a>
          </div>

          {/* --- 匿名体験エリア --- */}
          <div className="w-full pt-6 border-t border-gray-300 flex flex-col items-center">
            <p className="text-sm text-gray-600 mb-4">すぐに試したい方</p>
            <button
              onClick={() => handleLogin('匿名')}
              disabled={isLoading}
              className={`
                px-8 py-3 w-full md:w-auto
                border border-gray-400 rounded-lg
                text-gray-600 font-medium text-sm
                hover:bg-gray-100 hover:text-gray-800 transition-colors
                active:scale-[0.98]
                ${isLoading ? 'opacity-70 cursor-wait' : ''}
              `}
            >
              匿名で体験する
            </button>
          </div>

        </div>
      </main>

      {/* --- フッターエリア --- */}
      <footer className="w-full py-8 text-center text-xs text-gray-500 border-t border-gray-200 bg-white">
        <div className="flex justify-center gap-6 mb-4">
          <a href="#" className="hover:text-gray-800 hover:underline">利用規約</a>
          <a href="#" className="hover:text-gray-800 hover:underline">プライバシーポリシー</a>
          <a href="#" className="hover:text-gray-800 hover:underline">ヘルプ</a>
        </div>
        <p>© 2025 VNS masakinihirota</p>
      </footer>

    </div>
  );
}

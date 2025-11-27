"use client"

import React, { useState, useEffect } from 'react';
import {
  Menu, X, Shield, Handshake, Sparkles,
  ArrowRight, Twitter, ChevronRight, User,
  Users, PartyPopper, LogIn, UserPlus
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // スクロール検知によるヘッダーのスタイル変更
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 共通ボタンスタイル
  const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2";
    const variants = {
      primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg hover:shadow-emerald-500/30",
      secondary: "bg-transparent border-2 border-white text-white hover:bg-white/10",
      outline: "bg-transparent border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white",
      text: "bg-transparent text-slate-600 hover:text-emerald-600 px-4 py-2 hover:bg-emerald-50 rounded-lg font-medium hover:scale-100"
    };

    return (
      <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* ヘッダーエリア */}
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
          {/* ロゴ */}
          <div
            className="flex items-center gap-2 cursor-pointer z-50"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg ${scrolled ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600'}`}>
              V
            </div>
            <span className={`text-xl font-bold tracking-tight ${scrolled ? 'text-slate-800' : 'text-white'}`}>
              masakinihirota
            </span>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="text"
              className={!scrolled && "text-white hover:text-emerald-200 hover:bg-white/10"}
              onClick={() => window.location.href = '/login'}
            >
              <LogIn size={18} />
              ログイン
            </Button>
            <Button
              variant="primary"
              className="px-6 py-2 text-sm"
              onClick={() => window.location.href = '/signup'}
            >
              <UserPlus size={18} />
              会員登録
            </Button>
          </nav>

          {/* ハンバーガーメニュー (スマホ) */}
          <button
            className={`md:hidden p-2 z-50 ${scrolled ? 'text-slate-800' : 'text-white'}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* モバイルメニューオーバーレイ */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-lg z-40 flex flex-col items-center justify-center gap-8 md:hidden">
            <Button variant="secondary" className="w-64" onClick={() => window.location.href = '/login'}>
              ログイン
            </Button>
            <Button variant="primary" className="w-64" onClick={() => window.location.href = '/signup'}>
              会員登録
            </Button>
            <button className="text-slate-400 mt-8" onClick={toggleMenu}>
              閉じる
            </button>
          </div>
        )}
      </header>

      {/* メインビジュアル（ヒーローセクション） */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* 背景装飾 (画像がない場合のグラデーションとパターン) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/40"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-8 pt-20">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-wide animate-fade-in-up">
            昨日僕が感動した作品を、<br className="md:hidden" />
            <span className="text-emerald-400">今日の君はまだ知らない。</span>
          </h1>

          <div className="flex flex-col items-center gap-2 mt-4 text-slate-300 animate-fade-in-up delay-100">
            <span className="text-xl font-medium tracking-widest">masakinihirota</span>
            <span className="text-sm bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">VNS Concept</span>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-8 w-full md:w-auto animate-fade-in-up delay-200">
            <Button variant="primary" className="w-full md:w-auto text-lg px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 border-none">
              🎯 匿名で今すぐ体験する
            </Button>
            <Button variant="secondary" className="w-full md:w-auto text-lg px-8 py-4">
              ✈ 会員登録
            </Button>
          </div>
        </div>

        {/* 下部へのスクロール誘導 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <ChevronRight className="rotate-90 w-8 h-8" />
        </div>
      </section>

      {/* サービス特徴セクション */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-slate-800">
            VNSの<span className="text-emerald-600">3つの特徴</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 特徴1 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">安心・安全な<br />オアシス空間</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                ネガティブな発言を制限し、幸福追求権を優先します。
                <br />誰もが安心して過ごせる場所を提供します。
              </p>
            </div>

            {/* 特徴2 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Handshake size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">価値観で<br />つながる</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                好きな作品や似た価値観でマッチング。
                <br />「千の仮面」で新しい自分を見つけましょう。
              </p>
            </div>

            {/* 特徴3 */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center group">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-slate-800">自分の価値観にあった<br />情報を発見</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                選んだ人が推薦する素晴らしい作品に出会う。
                <br />情報の洪水から、真の価値を選び取ります。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フロー説明 */}
      <section className="py-20 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-800">ご利用の流れ</h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600">
                <User size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">プロフィール作成</h4>
              <p className="text-sm text-slate-500">あなたの「好き」を登録</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-slate-300">
              <ArrowRight size={32} />
            </div>
            <div className="md:hidden text-slate-300 rotate-90 my-2">
              <ArrowRight size={24} />
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600">
                <Users size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">マッチング</h4>
              <p className="text-sm text-slate-500">価値観の合う仲間を発見</p>
            </div>

            {/* Arrow */}
            <div className="hidden md:block text-slate-300">
              <ArrowRight size={32} />
            </div>
            <div className="md:hidden text-slate-300 rotate-90 my-2">
              <ArrowRight size={24} />
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center max-w-xs">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-slate-600">
                <PartyPopper size={32} />
              </div>
              <h4 className="font-bold text-lg mb-2">パーティ結成</h4>
              <p className="text-sm text-slate-500">共感の輪を広げよう</p>
            </div>
          </div>

          <a href="#" className="inline-flex items-center text-emerald-600 font-bold hover:underline hover:text-emerald-700 transition-colors">
            詳細を見る <ChevronRight size={18} />
          </a>
        </div>
      </section>

      {/* オアシス宣言・人間宣言 */}
      <section className="py-24 px-4 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">VNSの基本理念</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* オアシス宣言 */}
            <div className="bg-slate-800 p-8 md:p-12 rounded-2xl border border-slate-700 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-400">
                <Shield size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-emerald-400">
                  <Shield size={28} /> オアシス宣言
                </h3>
                <p className="text-slate-300 mb-6 text-lg">
                  「安心、安全な場所の提供」
                </p>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  ここは誰も傷つけられることのない、心の休息地。互いの尊厳を守り、肯定し合う空間であることを誓います。
                </p>
                <a href="/oasis-declaration" className="text-white border-b border-emerald-500 pb-1 hover:text-emerald-400 transition-colors inline-flex items-center gap-2">
                  全文を読む <ArrowRight size={16} />
                </a>
              </div>
            </div>

            {/* 人間宣言 */}
            <div className="bg-slate-800 p-8 md:p-12 rounded-2xl border border-slate-700 relative overflow-hidden group hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-blue-400">
                <Handshake size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-blue-400">
                  <Handshake size={28} /> 人間宣言
                </h3>
                <p className="text-slate-300 mb-6 text-lg">
                  「人は間違えることもある。包容力を持って見守る。」
                </p>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  完全な人間などいません。失敗を許し、再挑戦を応援する。そんな温かい眼差しを持つことをここに宣言します。
                </p>
                <a href="/human-declaration" className="text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors inline-flex items-center gap-2">
                  全文を読む <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 最新情報・SNS */}
      <section className="py-20 px-4 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center justify-center gap-2 text-slate-800">
            <Twitter className="text-slate-800" /> 最新情報
          </h2>
          <p className="text-slate-600 mb-8">
            X.com（Twitter）にて開発状況やイベント情報を発信しています。<br />
            ぜひフォローして最新情報をチェックしてください。
          </p>
          <a
            href="https://twitter.com/masakinihirota"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-3 rounded-full hover:bg-slate-800 transition-colors font-bold"
          >
            <Twitter size={20} />
            @masakinihirota をフォロー
          </a>
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-slate-100 text-slate-600 py-12 px-4 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold text-lg">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded flex items-center justify-center text-xs">V</div>
              masakinihirota
            </div>
            <p className="text-sm text-slate-500">
              価値観でつながる、安心・安全なオアシス。
            </p>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">理念</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/oasis-declaration" className="hover:text-emerald-600 transition-colors">オアシス宣言</a></li>
              <li><a href="/human-declaration" className="hover:text-emerald-600 transition-colors">人間宣言</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">サポート</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/report" className="hover:text-emerald-600 transition-colors">お問い合わせ</a></li>
              <li><a href="/help" className="hover:text-emerald-600 transition-colors">ヘルプセンター</a></li>
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="font-bold text-slate-800 mb-4">法務</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/terms-of-service" className="hover:text-emerald-600 transition-colors">利用規約</a></li>
              <li><a href="/privacy-policy" className="hover:text-emerald-600 transition-colors">プライバシーポリシー</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
          © 2025 VNS masakinihirota. All rights reserved.
        </div>
      </footer>

      {/* 簡易的なCSSアニメーションの追加定義 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
};

export default LandingPage;

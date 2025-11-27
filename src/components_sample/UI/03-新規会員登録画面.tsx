"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Github, Check, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

// --- Components ---

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon }) => {
    const baseStyles = "relative flex items-center justify-center gap-3 w-full rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-70 disabled:cursor-not-allowed";

    // Responsive sizing based on spec (PC: 400px, Tablet: 350px, SP: 90%/max320px handled by container)
    const sizeStyles = "h-12 md:h-14 text-base";

    const variants = {
        google: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-200 shadow-sm",
        github: "bg-[#24292e] text-white hover:bg-[#2f363d] focus:ring-gray-500 shadow-sm",
        anonymous: "bg-transparent border border-gray-400 text-gray-600 hover:bg-gray-50 hover:text-gray-800 focus:ring-gray-300 border-dashed",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${sizeStyles} ${variants[variant]} ${className}`}
            disabled={disabled}
        >
            {icon && <span className="absolute left-6">{icon}</span>}
            <span>{children}</span>
        </button>
    );
};

// --- Main Application ---

export default function RegisterScreen() {
    const [isAgreed, setIsAgreed] = useState(true); // Default true per spec
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Clear error when agreement changes
    useEffect(() => {
        if (isAgreed && error === "オアシス宣言と利用規約への同意が必要です。") {
            setError(null);
        }
    }, [isAgreed, error]);

    const handleRegister = async (provider) => {
        // 1. Validation
        if (!isAgreed) {
            setError("オアシス宣言と利用規約への同意が必要です。");
            return;
        }

        // 2. Loading State
        setIsLoading(true);
        setError(null);

        // 3. Mock Authentication Process
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate random network error for demonstration (10% chance)
            if (Math.random() < 0.1) {
                throw new Error("NETWORK_ERROR");
            }

            console.log(`${provider} authentication successful. Redirecting to /onboarding...`);
            alert(`${provider}での認証に成功しました！\nオンボーディング画面へ遷移します。`);
            // window.location.href = '/onboarding'; // In real app

        } catch (err) {
            if (err.message === "NETWORK_ERROR") {
                setError("ネットワークエラーが発生しました。インターネット接続を確認してください。");
            } else {
                setError("登録に失敗しました。もう一度お試しください。");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">

            {/* --- Header Area --- */}
            <header className="w-full max-w-5xl mx-auto p-4 md:p-6 flex items-center justify-between relative">
                <a href="#" className="flex items-center text-gray-500 hover:text-gray-800 transition-colors gap-1 text-sm md:text-base group">
                    <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 group-hover:-translate-x-1 transition-transform" />
                    <span>トップに戻る</span>
                </a>

                {/* Logo centered visually in the header area if needed, or just part of the flow */}
            </header>

            {/* --- Main Content Area --- */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-12">

                {/* Logo / Brand */}
                <div className="mb-8 text-center">
                    <div className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mb-2">
                        VNS masakinihirota
                    </div>
                    <p className="text-gray-500 text-sm">Create your new account</p>
                </div>

                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-[320px] md:max-w-[400px] lg:max-w-[480px] p-6 md:p-10 border border-gray-100">

                    <h1 className="text-xl md:text-2xl font-bold text-center mb-8 text-gray-800">
                        新規会員登録
                    </h1>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3 animate-pulse">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-red-700 font-medium">
                                {error}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Google Button */}
                        <Button
                            variant="google"
                            onClick={() => handleRegister('Google')}
                            disabled={isLoading}
                            icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin text-gray-500" /> : <GoogleIcon />}
                        >
                            {isLoading ? '通信中...' : 'Google で登録'}
                        </Button>

                        {/* GitHub Button */}
                        <Button
                            variant="github"
                            onClick={() => handleRegister('GitHub')}
                            disabled={isLoading}
                            icon={isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : <Github className="w-5 h-5" />}
                        >
                            {isLoading ? '通信中...' : 'GitHub で登録'}
                        </Button>
                    </div>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-white text-gray-500">または</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <div className="text-center mb-8">
                        <p className="text-sm text-gray-600 mb-1">すでにアカウントをお持ちの方</p>
                        <a href="#" className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline transition-all">
                            ログインはこちら
                        </a>
                    </div>

                    {/* Anonymous Section */}
                    <div className="pt-2">
                        <div className="text-center mb-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">すぐに試したい方</p>
                        </div>
                        <Button
                            variant="anonymous"
                            onClick={() => handleRegister('Anonymous')}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            匿名で体験する
                        </Button>
                    </div>

                    {/* Consent Checkbox */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <label className="flex items-start gap-3 cursor-pointer group">
                            <div className="relative flex items-center pt-0.5">
                                <input
                                    type="checkbox"
                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-blue-500 checked:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    checked={isAgreed}
                                    onChange={(e) => setIsAgreed(e.target.checked)}
                                />
                                <Check className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" strokeWidth={3} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-600 leading-snug select-none">
                                <a href="#" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-0.5">
                                    オアシス宣言
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                と
                                <a href="#" className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-0.5">
                                    利用規約
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                                に同意します
                            </div>
                        </label>
                    </div>

                </div>
            </main>

            {/* --- Footer Area --- */}
            <footer className="py-6 text-center text-xs text-gray-400">
                <div className="flex justify-center gap-4 mb-2">
                    <a href="#" className="hover:text-gray-600 transition-colors">利用規約</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">プライバシーポリシー</a>
                    <a href="#" className="hover:text-gray-600 transition-colors">ヘルプ</a>
                </div>
                <p>© 2025 VNS masakinihirota</p>
            </footer>

        </div>
    );
}

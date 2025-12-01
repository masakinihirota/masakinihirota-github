
'use client';

import { useState } from 'react';
import { Camera, Shield, User, Briefcase, Smile, Heart, Globe, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProfileCreateDemoPage() {
    const [formData, setFormData] = useState({
        displayName: '',
        username: '',
        bio: '',
        role: 'member',
        purpose: 'play',
        type: 'self',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleSelect = (role: string) => {
        setFormData(prev => ({ ...prev, role }));
    };

    const handlePurposeSelect = (purpose: string) => {
        setFormData(prev => ({ ...prev, purpose }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
        }, 1500);
    };

    if (isSuccess) {
        return (
            <div className="max-w-2xl mx-auto pt-16 text-center space-y-6">
                <div className="mx-auto h-24 w-24 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">プロフィール作成完了！</h1>
                <p className="text-gray-600 text-lg">
                    新しいプロフィール「{formData.displayName}」が作成されました。<br />
                    Lvがアップしました！ (Lv1 → Lv2)
                </p>
                <div className="pt-8">
                    <Link href="/playground/profile-demo" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        プロフィールを確認する
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900">プロフィール作成</h1>
                <p className="text-gray-500">あなたの分身となるプロフィールを作成しましょう。</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 1. 基本情報 */}
                <div className="p-8 space-y-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mr-3">1</span>
                        基本情報
                    </h2>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group cursor-pointer">
                            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-blue-400 transition-colors">
                                <Camera className="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 text-white shadow-sm">
                                <Camera className="h-3 w-3" />
                            </div>
                        </div>
                        <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">アイコンを設定</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                表示名 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                id="displayName"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                placeholder="例: 山田 太郎"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                ID (@username) <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    @
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    pattern="[a-zA-Z0-9_]+"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="taroyamada"
                                    className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                                />
                            </div>
                            <p className="mt-1 text-xs text-gray-500">半角英数字とアンダースコアのみ使用可能</p>
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                自己紹介
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="あなたの興味や活動について教えてください"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                            />
                            <p className="mt-1 text-xs text-gray-500 text-right">{formData.bio.length}/1000</p>
                        </div>
                    </div>
                </div>

                {/* 2. 属性設定 */}
                <div className="p-8 space-y-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mr-3">2</span>
                        属性設定
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">役割 <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect('leader')}
                                    className={`relative flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors ${formData.role === 'leader' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <Shield className={`h-6 w-6 mb-2 ${formData.role === 'leader' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-medium text-gray-900">リーダー</span>
                                    <span className="text-xs text-gray-500 mt-1">組織を率いる・作る</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect('member')}
                                    className={`relative flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors ${formData.role === 'member' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <User className={`h-6 w-6 mb-2 ${formData.role === 'member' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-medium text-gray-900">メンバー</span>
                                    <span className="text-xs text-gray-500 mt-1">組織に参加する・支える</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">目的 <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {['work', 'play', 'marriage', 'other'].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => handlePurposeSelect(p)}
                                        className={`flex items-center justify-center px-3 py-2 border rounded-md text-sm font-medium transition-colors ${formData.purpose === p ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {p === 'work' && <Briefcase className="h-4 w-4 mr-2" />}
                                        {p === 'play' && <Smile className="h-4 w-4 mr-2" />}
                                        {p === 'marriage' && <Heart className="h-4 w-4 mr-2" />}
                                        {p === 'other' && <Globe className="h-4 w-4 mr-2" />}
                                        {p === 'work' ? '仕事' : p === 'play' ? '遊び' : p === 'marriage' ? '婚活' : 'その他'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                種類 <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                            >
                                <option value="self">本人（実名/匿名）</option>
                                <option value="interview">インタビュー</option>
                                <option value="other_perspective">他人視点</option>
                                <option value="ai">AIキャラクター</option>
                                <option value="fictional">架空の人物</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 3. ソーシャル連携 */}
                <div className="p-8 space-y-6">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold mr-3">3</span>
                        ソーシャル連携（任意）
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">X</div>
                                <span className="ml-3 text-sm font-medium text-gray-900">X (Twitter)</span>
                            </div>
                            <button type="button" className="text-sm text-blue-600 hover:text-blue-500 font-medium">連携する</button>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                                <div className="h-8 w-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-xs">GH</div>
                                <span className="ml-3 text-sm font-medium text-gray-900">GitHub</span>
                            </div>
                            <button type="button" className="text-sm text-gray-400 font-medium" disabled>連携済み</button>
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/playground" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                        キャンセル
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                作成中...
                            </>
                        ) : (
                            'プロフィールを作成'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

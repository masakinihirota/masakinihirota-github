
'use client';

import { useState, useEffect } from 'react';
import { Camera, Shield, User, Briefcase, Smile, Heart, Globe, Save, X, Trash2, Eye, Lock, Users } from 'lucide-react';
import Link from 'next/link';
import { profile } from '../profile-demo/data';

export default function ProfileEditDemoPage() {
    // Map Japanese data values to internal English keys
    const mapPurpose = (p: string) => {
        if (p === '仕事') return 'work';
        if (p === '遊び') return 'play';
        if (p === '婚活') return 'marriage';
        return 'other';
    };
    const mapRole = (r: string) => r === 'リーダー' ? 'leader' : 'member';
    const mapType = (t: string) => {
        if (t.includes('本人')) return 'self';
        if (t === 'インタビュー') return 'interview';
        if (t === '他人視点') return 'other_perspective';
        if (t === 'AIキャラクター') return 'ai';
        return 'fictional';
    };

    const [formData, setFormData] = useState({
        displayName: profile.name,
        username: 'taroyamada', // Dummy username as it's not in data.ts
        bio: profile.bio,
        role: mapRole(profile.role),
        purpose: mapPurpose(profile.purpose),
        type: mapType(profile.type),
        visibility: 'public',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

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

    const handleVisibilitySelect = (visibility: string) => {
        setFormData(prev => ({ ...prev, visibility }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 1000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-fade-in-down z-50">
                    <Save className="h-5 w-5 mr-2" />
                    プロフィールを更新しました
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900">プロフィール編集</h1>
                    <p className="text-gray-500">登録情報を変更します。</p>
                </div>
                <Link href="/playground/profile-demo" className="text-sm text-gray-500 hover:text-gray-900 flex items-center">
                    <X className="h-4 w-4 mr-1" />
                    キャンセルして戻る
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* 1. 基本情報 */}
                <div className="p-8 space-y-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group cursor-pointer">
                            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                                <img src={`https://ui-avatars.com/api/?name=${formData.displayName}&size=128`} alt={formData.displayName} className="h-full w-full object-cover" />
                            </div>
                            <div className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-1.5 text-white shadow-sm group-hover:bg-blue-600 transition-colors">
                                <Camera className="h-3 w-3" />
                            </div>
                        </div>
                        <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">アイコンを変更</span>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                表示名
                            </label>
                            <input
                                type="text"
                                name="displayName"
                                id="displayName"
                                required
                                value={formData.displayName}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                ID (@username) <span className="text-xs text-gray-400 ml-2">変更不可</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                    @
                                </span>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    aria-disabled="true"
                                    value={formData.username}
                                    className="flex-1 block w-full rounded-none rounded-r-md border-solid-gray-300 bg-solid-gray-50 text-solid-gray-420 sm:text-sm px-4 py-2 border cursor-not-allowed aria-disabled:pointer-events-none"
                                />
                            </div>
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
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2 border"
                            />
                            <p className="mt-1 text-xs text-gray-500 text-right">{formData.bio.length}/1000</p>
                        </div>
                    </div>
                </div>

                {/* 2. 属性設定 */}
                <div className="p-8 space-y-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900">属性設定</h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">役割</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect('leader')}
                                    className={`relative flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors ${formData.role === 'leader' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <Shield className={`h-6 w-6 mb-2 ${formData.role === 'leader' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-medium text-gray-900">リーダー</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleSelect('member')}
                                    className={`relative flex flex-col items-center p-4 border rounded-lg hover:bg-blue-50 transition-colors ${formData.role === 'member' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 bg-white'}`}
                                >
                                    <User className={`h-6 w-6 mb-2 ${formData.role === 'member' ? 'text-blue-600' : 'text-gray-400'}`} />
                                    <span className="text-sm font-medium text-gray-900">メンバー</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">目的</label>
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
                                種類
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

                {/* 3. 詳細設定 (公開範囲) */}
                <div className="p-8 space-y-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">詳細設定</h2>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">公開範囲</label>
                        <div className="space-y-3">
                            {[
                                { id: 'public', label: '全体公開', icon: Globe, desc: '誰でも閲覧できます' },
                                { id: 'login', label: 'ログイン限定', icon: User, desc: 'ログインユーザーのみ閲覧できます' },
                                { id: 'followers', label: '相互フォロワー限定', icon: Users, desc: '相互フォローのユーザーのみ閲覧できます' },
                                { id: 'private', label: '非公開', icon: Lock, desc: '自分だけが閲覧できます' },
                            ].map((v) => (
                                <div
                                    key={v.id}
                                    onClick={() => handleVisibilitySelect(v.id)}
                                    className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${formData.visibility === v.id ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200'}`}
                                >
                                    <div className={`p-2 rounded-full mr-3 ${formData.visibility === v.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <v.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{v.label}</div>
                                        <div className="text-xs text-gray-500">{v.desc}</div>
                                    </div>
                                    <div className="ml-auto">
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${formData.visibility === v.id ? 'border-blue-600' : 'border-gray-300'}`}>
                                            {formData.visibility === v.id && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <button
                        type="button"
                        className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center"
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        プロフィールを削除
                    </button>
                    <div className="flex items-center space-x-4">
                        <Link href="/playground/profile-demo" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            aria-disabled={isSubmitting}
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    保存中...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    変更を保存
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

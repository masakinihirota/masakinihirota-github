
'use client';

import { useState } from 'react';
import { userSettings, languages, timezones } from './data';
import { Check, X, AlertTriangle } from 'lucide-react';

type Tab = 'account' | 'privacy' | 'security' | 'connections' | 'payment';

export default function SettingsDemoPage() {
    const [activeTab, setActiveTab] = useState<Tab>('account');
    const [settings, setSettings] = useState(userSettings);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleSave = () => {
        // Mock save
        setMessage({ type: 'success', text: '設定を保存しました!' });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleToggleConnection = (service: 'google' | 'github') => {
        setSettings((prev) => ({
            ...prev,
            connections: {
                ...prev.connections,
                [service]: !prev.connections[service],
            },
        }));
        const action = !settings.connections[service] ? '連携しました' : '連携を解除しました';
        setMessage({ type: 'success', text: `${service === 'google' ? 'Google' : 'GitHub'}と${action}!` });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">設定</h1>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {[
                        { id: 'account', label: 'アカウント' },
                        { id: 'privacy', label: 'プライバシー' },
                        { id: 'security', label: 'セキュリティ' },
                        { id: 'connections', label: '連携サービス' },
                        { id: 'payment', label: '支払い' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {message.type === 'success' ? (
                                <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                            )}
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">{message.text}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">

                {/* Account Settings */}
                {activeTab === 'account' && (
                    <div className="p-6 space-y-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-medium text-gray-900">アカウント設定</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">メールアドレス</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                        Email
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={settings.account.email}
                                        readOnly
                                    />
                                    <button className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        変更
                                    </button>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">表示名</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="displayName"
                                        id="displayName"
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        value={settings.account.displayName}
                                        onChange={(e) => setSettings({ ...settings, account: { ...settings.account, displayName: e.target.value } })}
                                    />
                                    <button className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        変更
                                    </button>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700">言語</label>
                                <div className="mt-1">
                                    <select
                                        id="language"
                                        name="language"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                        value={settings.account.language}
                                        onChange={(e) => setSettings({ ...settings, account: { ...settings.account, language: e.target.value } })}
                                    >
                                        {languages.map((lang) => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">タイムゾーン</label>
                                <div className="mt-1">
                                    <select
                                        id="timezone"
                                        name="timezone"
                                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                                        value={settings.account.timezone}
                                        onChange={(e) => setSettings({ ...settings, account: { ...settings.account, timezone: e.target.value } })}
                                    >
                                        {timezones.map((tz) => (
                                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    保存する
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                    <div className="p-6 space-y-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-medium text-gray-900">プライバシー設定</h2>
                        </div>

                        <fieldset>
                            <div className="space-y-6">
                                {[
                                    { id: 'profilePublic', label: 'プロフィールの公開' },
                                    { id: 'worksPublic', label: '作品リストの公開' },
                                    { id: 'valuesPublic', label: '価値観の公開' },
                                    { id: 'skillsPublic', label: 'スキルの公開' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <div className="flex items-center space-x-4">
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        className="form-radio text-blue-600"
                                                        name={item.id}
                                                        checked={settings.privacy[item.id as keyof typeof settings.privacy]}
                                                        onChange={() => setSettings({ ...settings, privacy: { ...settings.privacy, [item.id]: true } })}
                                                    />
                                                    <span className="ml-2 text-gray-700">公開</span>
                                                </label>
                                                <label className="inline-flex items-center">
                                                    <input
                                                        type="radio"
                                                        className="form-radio text-blue-600"
                                                        name={item.id}
                                                        checked={!settings.privacy[item.id as keyof typeof settings.privacy]}
                                                        onChange={() => setSettings({ ...settings, privacy: { ...settings.privacy, [item.id]: false } })}
                                                    />
                                                    <span className="ml-2 text-gray-700">非公開</span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label className="font-medium text-gray-700 w-40 inline-block">{item.label}</label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </fieldset>

                        <div className="pt-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    保存する
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                    <div className="p-6 space-y-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-medium text-gray-900">セキュリティ設定</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">パスワード変更</h3>
                                <div className="mt-2">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        パスワードを変更する
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">二要素認証</h3>
                                <div className="mt-2 flex items-center">
                                    <input
                                        id="twoFactor"
                                        name="twoFactor"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        checked={settings.security.twoFactorEnabled}
                                        onChange={(e) => setSettings({ ...settings, security: { ...settings.security, twoFactorEnabled: e.target.checked } })}
                                    />
                                    <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-900">
                                        有効にする
                                    </label>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">ログイン履歴</h3>
                                <div className="mt-2">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        ログイン履歴を見る
                                    </button>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-200">
                                <h3 className="text-sm font-medium text-red-600">アカウント削除</h3>
                                <p className="mt-1 text-sm text-gray-500">アカウントを削除すると、すべてのデータが完全に消去されます。</p>
                                <div className="mt-4">
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                                        アカウントを削除する
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Connections Settings */}
                {activeTab === 'connections' && (
                    <div className="p-6 space-y-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-medium text-gray-900">連携サービス</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Google</h3>
                                    <p className="text-sm text-gray-500">
                                        {settings.connections.google ? '✅ 連携済み' : '❌ 未連携'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleConnection('google')}
                                    className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${settings.connections.google
                                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                                            : 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                        }`}
                                >
                                    {settings.connections.google ? '解除する' : '連携する'}
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">GitHub</h3>
                                    <p className="text-sm text-gray-500">
                                        {settings.connections.github ? '✅ 連携済み' : '❌ 未連携'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleToggleConnection('github')}
                                    className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${settings.connections.github
                                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                                            : 'border-transparent text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                        }`}
                                >
                                    {settings.connections.github ? '解除する' : '連携する'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Settings */}
                {activeTab === 'payment' && (
                    <div className="p-6 space-y-6">
                        <div className="border-b border-gray-200 pb-4 mb-4">
                            <h2 className="text-lg font-medium text-gray-900">支払い設定</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900">現在のプラン</h3>
                                <div className="mt-2 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                                    <span className="text-lg font-bold text-gray-900">{settings.payment.plan}</span>
                                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        プランをアップグレード
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">支払い方法</h3>
                                <div className="mt-2 flex items-center justify-between bg-gray-50 p-4 rounded-md">
                                    <div className="flex items-center">
                                        <span className="text-gray-900">クレジットカード: **** **** **** {settings.payment.cardLast4}</span>
                                    </div>
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        支払い方法を変更する
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-900">支払い履歴</h3>
                                <div className="mt-2">
                                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                        支払い履歴を見る
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

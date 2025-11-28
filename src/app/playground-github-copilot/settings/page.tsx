import { settingsDummy } from './dummy'

export const metadata = { title: '設定サンプル' }

export default function SettingsSample() {
    const d = settingsDummy
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-3">設定（ダミー）</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2">アカウント</h4>
                    <div className="text-sm">メール: {d.account.email}</div>
                    <div className="text-sm">表示名: {d.account.display_name}</div>
                </div>

                <div className="border rounded p-4">
                    <h4 className="font-semibold mb-2">プライバシー</h4>
                    <div className="text-sm">プロフィール公開: {d.privacy.profile ? '公開' : '非公開'}</div>
                    <div className="text-sm">作品リスト公開: {d.privacy.works ? '公開' : '非公開'}</div>
                </div>
            </div>
        </div>
    )
}

import * as Settings from '@/components/settings';

export const metadata = { title: '設定 — masakinihirota' };

/**
 * 設定ページ
 *
 * ルーティング（ページ）とコンポーネント（UI/ビジネスロジック）を分離。
 * ページは表示とコンポーネントの組み立てに専念します。
 */
export default function SettingsPage() {
    return (
        <div>
            <Settings.Settings />
        </div>
    );
}

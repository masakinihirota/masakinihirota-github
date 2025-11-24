import * as RootAccount from '@/components/root-account';

export const metadata = { title: 'ルートアカウント — masakinihirota' };

/**
 * ルートアカウントページ
 *
 * ルーティング（ページ）とコンポーネント（UI/ビジネスロジック）を分離。
 * ページは表示とコンポーネントの組み立てに専念します。
 */
export default function RootAccountPage() {
    return (
        <div>
            <RootAccount.RootAccountsDashboard />
        </div>
    );
}

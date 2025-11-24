import * as RootAccount from '@/components/root-account';

export const metadata = { title: 'ルートアカウント作成 — masakinihirota' };

/**
 * ルートアカウント作成ページ
 *
 * ルーティング（ページ）とコンポーネント（UI/ビジネスロジック）を分離。
 * ページは表示とコンポーネントの組み立てに専念します。
 */
export default function CreateRootAccountPage() {
    return (
        <div>
            <RootAccount.CreateRootAccount />
        </div>
    );
}

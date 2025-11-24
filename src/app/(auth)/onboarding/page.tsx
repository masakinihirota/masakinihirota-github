import * as Onboarding from '@/components/onboarding';

export const metadata = { title: 'オンボーディング — masakinihirota' };

/**
 * オンボーディングページ
 *
 * ルーティング（ページ）とコンポーネント（UI/ビジネスロジック）を分離。
 * ページは表示とコンポーネントの組み立てに専念します。
 */
export default function OnboardingPage() {
    return (
        <div>
            <Onboarding.Onboarding />
        </div>
    );
}

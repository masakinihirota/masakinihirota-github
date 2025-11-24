import * as Skills from '@/components/skills';

export const metadata = { title: 'スキル — masakinihirota' };

/**
 * スキルページ
 *
 * ルーティング（ページ）とコンポーネント（UI/ビジネスロジック）を分離。
 * ページは表示とコンポーネントの組み立てに専念します。
 */
export default function SkillsPage() {
    return (
        <div>
            <Skills.Skills />
        </div>
    );
}

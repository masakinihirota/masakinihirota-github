import React from 'react';
import Link from 'next/link';
import { samples } from '../samplesMeta';

// import sample components (these files live under src/components_sample/UI)
import Sample01 from '@/components_sample/UI/01-ランディングページ(LP)';
import Sample02 from '@/components_sample/UI/02-ログイン画面';
import Sample03 from '@/components_sample/UI/03-新規会員登録画面';
import Sample04 from '@/components_sample/UI/04-オンボーディング画面';
import Sample05 from '@/components_sample/UI/05-HOME画面';
import Sample06 from '@/components_sample/UI/06-ルートアカウント画面';
import Sample07 from '@/components_sample/UI/07-ユーザープロフィール画面';
import Sample08 from '@/components_sample/UI/08-作品一覧画面';
import Sample09 from '@/components_sample/UI/09-作品詳細画面';
import Sample10 from '@/components_sample/UI/10-作品登録画面';
import Sample11 from '@/components_sample/UI/11-組織一覧画面';
import Sample12 from '@/components_sample/UI/12-国一覧画面';
import Sample13 from '@/components_sample/UI/13-マッチング設定画面';
import Sample14 from '@/components_sample/UI/14-検索画面';
import Sample15 from '@/components_sample/UI/15-設定画面';
import Sample16 from '@/components_sample/UI/16-オアシス宣言ページ';
import Sample17 from '@/components_sample/UI/17-利用規約ページ';

const componentsMap: Record<string, React.ComponentType<unknown>> = {
    '01-landing': Sample01,
    '02-login': Sample02,
    '03-signup': Sample03,
    '04-onboarding': Sample04,
    '05-home': Sample05,
    '06-root-account': Sample06,
    '07-user-profile': Sample07,
    '08-work-list': Sample08,
    '09-work-detail': Sample09,
    '10-create-work': Sample10,
    '11-organization-list': Sample11,
    '12-country-list': Sample12,
    '13-matching-settings': Sample13,
    '14-search': Sample14,
    '15-settings': Sample15,
    '16-oasis-declaration': Sample16,
    '17-terms': Sample17,
};

export async function generateStaticParams() {
    // Only generate params for slugs that actually have a component mapping.
    const available = samples.map((s) => s.slug).filter((s) => Object.prototype.hasOwnProperty.call(componentsMap, s));
    return available.map((slug) => ({ slug }));
}

export default function SamplePage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const Component = componentsMap[slug];
    if (!Component) {
        return (
            <div className="min-h-screen bg-white">
                <div className="container max-w-4xl py-12 text-center">
                    <h2 className="text-xl font-bold mb-4">サンプルが見つかりません</h2>
                    <p className="text-muted-foreground mb-6">このサンプルはまだ実装されていないか、利用できません。</p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/sample" className="text-emerald-600 hover:underline">一覧に戻る</Link>
                        <Link href="/" className="text-muted-foreground hover:underline">トップページへ</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container max-w-6xl py-12">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">{slug}</h1>
                    <div className="flex gap-4">
                        <Link href="/sample" className="text-sm text-emerald-600 hover:underline">一覧に戻る</Link>
                        <Link href="/" className="text-sm text-muted-foreground hover:underline">トップへ</Link>
                    </div>
                </div>
                <div className="rounded-lg border p-6">
                    {/* Render the sample component */}
                    <Component />
                </div>
            </div>
        </div>
    );
}

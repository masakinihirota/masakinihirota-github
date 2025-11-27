import React from 'react';
import Link from 'next/link';
import { samples } from '../samplesMeta';

// import sample components (these files live under src/components_sample/UI)

const componentsMap: Record<string, React.ComponentType<unknown>> = {
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

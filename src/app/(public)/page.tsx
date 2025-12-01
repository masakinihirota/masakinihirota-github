import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
    return (
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
                <Link
                    href="https://x.com/masakinihirota"
                    className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
                    target="_blank"
                >
                    Follow on X
                </Link>
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                    masakinihirota
                </h1>
                <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    ようこそ — 最初の一歩を踏み出しましょう。
                    <br />
                    価値観に基づくコミュニティ形成を支援するプラットフォームです。
                </p>
                <div className="space-x-4">
                    <Link href="/login">
                        <Button size="lg">ログイン</Button>
                    </Link>
                    {/* ルートから /home（メニュー付きページ）へ遷移できるようにする */}
                    <Link href="/home">
                        <Button variant="ghost" size="lg">Home</Button>
                    </Link>
                    <Link href="/home5">
                        <Button variant="secondary" size="lg">Home5 (新UI)</Button>
                    </Link>
                    <Link href="/onboarding/guest">
                        <Button variant="outline" size="lg">匿名で試す</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

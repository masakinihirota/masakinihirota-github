import Link from "next/link";
// publicNav intentionally not rendered in header to keep the unauthenticated header slim
import { ModeToggle } from "@/components/ModeToggle";
import { GlobalHeaderMenu } from "@/components/layout/GlobalHeaderMenu";
import AdToggle from '@/components/layout/AdToggle'
import LanguageToggle from '@/components/layout/LanguageToggle'
// Button removed from header — login/register buttons are intentionally hidden

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/home" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">masakinihirota</span>
                    </Link>
                    {/* Header nav: publicNav intentionally not shown here (reduces duplication) */}
                </div>
                <div className="flex flex-1 items-center justify-end space-x-3">
                    <GlobalHeaderMenu />
                    <div className="flex items-center gap-2">
                        <AdToggle />
                        <LanguageToggle />
                        <ModeToggle />
                        {/* Login / Register (removed from header — they are accessible from dedicated pages) */}
                    </div>
                </div>
            </div>
        </header>
    );
}

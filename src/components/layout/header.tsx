import Link from "next/link";
import { publicNav } from "@/config/nav";
import { ModeToggle } from "@/components/ModeToggle";
import { GlobalHeaderMenu } from "@/components/layout/GlobalHeaderMenu";
import AdToggle from '@/components/layout/AdToggle'
import LanguageToggle from '@/components/layout/LanguageToggle'
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/home" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">masakinihirota</span>
                    </Link>
                    {/* Header nav: show public links (kept slim) + quick-search */}
                        <nav className="hidden md:flex items-center space-x-4">
                            {publicNav.map((item) => (
                                <Link key={item.href} href={item.href} className="text-sm text-muted-foreground hover:text-foreground hover:underline underline-offset-4">
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                </div>
                <div className="flex flex-1 items-center justify-end space-x-3">
                    <GlobalHeaderMenu />
                    <div className="flex items-center gap-2">
                        <AdToggle />
                        <LanguageToggle />
                        <ModeToggle />
                        <nav className="flex items-center space-x-1">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">ログイン</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">新規登録</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

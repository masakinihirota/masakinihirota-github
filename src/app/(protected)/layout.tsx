import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
// authNav intentionally not rendered in header to reduce clutter; primary navigation lives in the left sidebar
import GlobalHeaderMenu from '@/components/layout/GlobalHeaderMenu';
import AdToggle from '@/components/layout/AdToggle';
import LanguageToggle from '@/components/layout/LanguageToggle';
import { ModeToggle } from '@/components/mode-toggle';
import Sidebar from "@/components/ui/Sidebar";

export const metadata = {
    title: "masakinihirota - Authenticated",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if ((error || !user) && process.env.NODE_ENV !== 'development') {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background text-foreground min-w-[1024px]">
            {/* Header is placed in the content column so sidebar remains top-left and is visually primary */}

            <div className="flex">
                <Sidebar />
                <div className="flex-1 max-w-4xl mx-auto">
                    <header className="py-2 border-b bg-background shadow-sm">
                        <div className="flex items-center justify-between h-12 px-6">
                            <div className="flex items-center gap-4">
                                {/* Header should be minimal on protected pages — primary identity lives in the left sidebar */}
                                <GlobalHeaderMenu />
                            </div>
                            <div className="flex items-center gap-3">
                                <AdToggle />
                                <LanguageToggle />
                                <ModeToggle />
                                <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground">アカウント</Link>
                            </div>
                        </div>
                    </header>

                    <main className="p-6">{children}</main>
                </div>
            </div>

            <footer className="p-6 text-center text-sm text-zinc-400">© masakinihirota</footer>
        </div>
    );
}

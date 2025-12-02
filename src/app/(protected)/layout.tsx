import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SidebarProvider, SidebarInset } from '@/components/ui/Sidebar';
import { AppSidebar } from '@/app/home5/components/AppSidebar';
import { GlobalHeader } from '@/app/home5/components/GlobalHeader';
import { Footer } from '@/app/home5/components/Footer';

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
        <SidebarProvider>
            {/* 左サイドメニュー */}
            <AppSidebar />

            {/* メインエリア（ヘッダー + コンテンツ + フッター） */}
            <SidebarInset>
                {/* ヘッダーメニュー */}
                <GlobalHeader />

                {/* メインコンテンツ */}
                <main className="flex-1 p-6">{children}</main>

                {/* フッターメニュー */}
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
}

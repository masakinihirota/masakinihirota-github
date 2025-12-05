import { SidebarProvider, SidebarInset } from '@/components/ui/Sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { GlobalHeader } from '@/components/layout/GlobalHeader';
import { Footer } from '@/components/layout/footer';

export const metadata = {
    title: "masakinihirota - Authenticated",
};

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    // 開発環境では認証チェックをスキップ
    // TODO: 本番環境では認証チェックを有効にする
    // const supabase = await createClient();
    // const { data: { user }, error } = await supabase.auth.getUser();
    // if ((error || !user) && process.env.NODE_ENV !== 'development') {
    //     redirect("/login");
    // }

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

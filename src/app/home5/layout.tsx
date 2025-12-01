import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/AppSidebar"
import { GlobalHeader } from "./components/GlobalHeader"
import { Footer } from "./components/Footer"

export const metadata = {
  title: "Home5 - masakinihirota",
  description: "認証後ダッシュボード - VNS Platform",
}

/**
 * Home5 レイアウト
 *
 * 要件定義書に基づく3カラム構成:
 * - 左カラム: グローバルナビゲーション（サイドバー）
 * - 中央+右: メインコンテンツ（ヘッダー + コンテンツ + フッター）
 *
 * 表示優先順:
 * 1. 左サイドメニュー
 * 2. ボディ
 * 3. ヘッダーメニュー
 * 4. フッターメニュー
 */
export default function Home5Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      {/* 左サイドメニュー */}
      <AppSidebar />

      {/* メインエリア（ヘッダー + コンテンツ + フッター） */}
      <SidebarInset>
        {/* ヘッダーメニュー */}
        <GlobalHeader />

        {/* メインコンテンツ */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* フッターメニュー（画面下部に固定表示） */}
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  )
}

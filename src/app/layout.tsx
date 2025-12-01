import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 全体に影響のあるものはここに書く
    // ダークモード、i18nなど
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ModeToggle is rendered inside page headers; keep root layout minimal */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

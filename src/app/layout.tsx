import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 全体に影響のあるものはここに書く
    // ダークモード、i18nなど
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}

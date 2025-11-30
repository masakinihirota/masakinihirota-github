export default function Home3Page() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">Home3 — 認証後トップページ (shadcn/ui)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 bg-card/50">
          <h2 className="font-semibold">クイックアクセス</h2>
          <p className="text-muted-foreground text-sm">よく使う機能に素早くアクセスできます。</p>
        </div>
        <div className="rounded-lg border p-4 bg-card/50">
          <h2 className="font-semibold">通知 / お知らせ</h2>
          <p className="text-muted-foreground text-sm">ここに重要な通知や最近のアクティビティが表示されます。</p>
        </div>
      </div>
    </section>
  );
}

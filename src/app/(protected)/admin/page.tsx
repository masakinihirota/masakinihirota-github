/**
 * Admin Dashboard Page
 * システム管理者向けダッシュボード画面
 */

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      {/* ヘッダー */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">管理者ダッシュボード</h1>
      </header>

      {/* システムステータス */}
      <section className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">システムステータス</h2>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span>正常稼働中</span>
        </div>
      </section>

      {/* KPIパネル */}
      <section className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">KPI</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded bg-gray-50 p-4">
            <div className="text-2xl font-bold">--</div>
            <div className="text-gray-600">総ユーザー数</div>
          </div>
          <div className="rounded bg-gray-50 p-4">
            <div className="text-2xl font-bold">--</div>
            <div className="text-gray-600">DAU</div>
          </div>
          <div className="rounded bg-gray-50 p-4">
            <div className="text-2xl font-bold">--</div>
            <div className="text-gray-600">投稿数</div>
          </div>
        </div>
      </section>

      {/* アラート一覧 */}
      <section className="mb-8 rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">アラート一覧</h2>
        <p className="text-gray-500">現在アラートはありません</p>
      </section>

      {/* 最近のアクティビティ */}
      <section className="rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">最近のアクティビティ</h2>
        <p className="text-gray-500">アクティビティはありません</p>
      </section>
    </div>
  );
}

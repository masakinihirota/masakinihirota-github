import { NotificationDetail, NotificationDetailData } from "./components/NotificationDetail";

// モックデータ
const mockNotification: NotificationDetailData = {
  id: "1",
  subject: "システムメンテナンスのお知らせ",
  sender: "運営チーム",
  receivedAt: "2024-01-15 10:00",
  content: `いつもVNS masakinihirotaをご利用いただきありがとうございます。

下記の日程でシステムメンテナンスを実施いたします。

【メンテナンス日時】
2024年1月20日（土）2:00 ～ 6:00（予定）

【影響範囲】
- サービス全般がご利用いただけません
- メンテナンス終了後、正常にご利用いただけます

ご不便をおかけしますが、何卒ご理解のほどよろしくお願いいたします。`,
  isRead: false,
  type: "important",
  attachments: [
    { name: "メンテナンス詳細.pdf", url: "/files/maintenance.pdf" },
  ],
};

interface PageProps {
  params: Promise<{ notification_id: string }>;
}

/**
 * 通知詳細ページ
 */
export default async function NotificationDetailPage({ params }: PageProps) {
  const { notification_id } = await params;
  // 実際にはここでAPIから通知データを取得
  const notification = { ...mockNotification, id: notification_id };

  return <NotificationDetail notification={notification} />;
}

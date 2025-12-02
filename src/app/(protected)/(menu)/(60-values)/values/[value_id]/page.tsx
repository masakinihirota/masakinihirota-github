import { ValueDetail } from "./components/ValueDetail";

export const metadata = { title: "価値観詳細 — masakinihirota" };

// モックデータ
const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "人生",
  description: "幸福の定義について考えましょう。自分なりの答えを見つけてください。",
  creator: "田中太郎",
  createdAt: "2025-01-01",
  answerCount: 42,
  myAnswer: undefined,
  answers: [
    {
      id: "a1",
      userId: "u1",
      userName: "佐藤花子",
      content: "家族と過ごす時間が幸せです。特に子供たちの笑顔を見ると心が満たされます。",
      createdAt: "2025-01-02",
      likes: 5,
    },
    {
      id: "a2",
      userId: "u2",
      userName: "鈴木一郎",
      content: "好きなことに没頭できる時間が幸せです。",
      createdAt: "2025-01-03",
      likes: 3,
    },
  ],
};

type PageProps = {
  params: Promise<{ value_id: string }>;
};

export default async function ValueDetailPage({ params }: PageProps) {
  const { value_id } = await params;

  // TODO: APIからデータを取得
  const value = { ...mockValue, id: value_id };

  return (
    <div className="container py-6">
      <ValueDetail value={value} />
    </div>
  );
}

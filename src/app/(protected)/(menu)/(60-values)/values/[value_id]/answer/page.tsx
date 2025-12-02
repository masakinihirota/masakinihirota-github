import { ValueAnswerForm } from "./components/ValueAnswerForm";

export const metadata = { title: "価値観回答 — masakinihirota" };

const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "人生",
  description: "幸福の定義について考えましょう。自分なりの答えを見つけてください。",
  myAnswer: undefined,
};

type PageProps = {
  params: Promise<{ value_id: string }>;
};

export default async function ValueAnswerPage({ params }: PageProps) {
  const { value_id } = await params;

  // TODO: APIからデータを取得
  const value = { ...mockValue, id: value_id };

  return (
    <div className="container py-6">
      <ValueAnswerForm value={value} />
    </div>
  );
}

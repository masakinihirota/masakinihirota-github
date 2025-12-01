import { ValueEditForm } from "./components/ValueEditForm";

export const metadata = { title: "価値観編集 — masakinihirota" };

const mockValue = {
  id: "1",
  title: "あなたにとって幸せとは？",
  category: "life",
  description: "幸福の定義について考えましょう",
};

type PageProps = {
  params: Promise<{ value_id: string }>;
};

export default async function ValueEditPage({ params }: PageProps) {
  const { value_id } = await params;

  // TODO: APIからデータを取得
  const value = { ...mockValue, id: value_id };

  return (
    <div className="container py-6">
      <ValueEditForm value={value} />
    </div>
  );
}

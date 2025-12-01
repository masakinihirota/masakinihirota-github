import { ValueList } from "./components/ValueList";

export const metadata = { title: "価値観一覧 — masakinihirota" };

// モックデータ（後でAPIから取得に変更）
const mockValues = [
  {
    id: "1",
    title: "あなたにとって幸せとは？",
    category: "人生",
    description: "幸福の定義について考えましょう",
    creator: "田中太郎",
    answerCount: 42,
  },
  {
    id: "2",
    title: "理想の働き方とは？",
    category: "仕事",
    description: "ワークライフバランスについて",
    answerCount: 28,
  },
  {
    id: "3",
    title: "大切にしている人間関係とは？",
    category: "人間関係",
    description: "人との繋がりについて考える",
    creator: "佐藤花子",
    answerCount: 15,
  },
];

export default function ValuesPage() {
  return (
    <div className="container py-6">
      <ValueList values={mockValues} />
    </div>
  );
}

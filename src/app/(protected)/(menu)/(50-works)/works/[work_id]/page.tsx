import { WorkDetail } from "./components/WorkDetail";

export const metadata = { title: "作品詳細 — masakinihirota" };

const mockWork = {
  id: "1",
  title: "鬼滅の刃",
  author: "吾峠呼世晴",
  category: "漫画",
  year: "2016",
  description: "大正時代を舞台に、人と鬼の戦いを描いた作品。",
  myRating: undefined,
  comments: [
    {
      id: "c1",
      userId: "u1",
      userName: "山田太郎",
      content: "とても面白かったです！キャラクターが魅力的でした。",
      createdAt: "2025-01-02",
    },
  ],
};

type PageProps = {
  params: Promise<{ work_id: string }>;
};

export default async function WorkDetailPage({ params }: PageProps) {
  const { work_id } = await params;

  // TODO: APIからデータを取得
  const work = { ...mockWork, id: work_id };

  return (
    <div className="container py-6">
      <WorkDetail work={work} />
    </div>
  );
}

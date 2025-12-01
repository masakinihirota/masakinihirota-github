import { WorkEditForm } from "./components/WorkEditForm";

export const metadata = { title: "作品編集 — masakinihirota" };

const mockWork = {
  id: "1",
  title: "鬼滅の刃",
  author: "吾峠呼世晴",
  category: "manga",
  year: "2016",
  description: "大正時代を舞台に、人と鬼の戦いを描いた作品。",
};

type PageProps = {
  params: Promise<{ work_id: string }>;
};

export default async function WorkEditPage({ params }: PageProps) {
  const { work_id } = await params;

  const work = { ...mockWork, id: work_id };

  return (
    <div className="container py-6">
      <WorkEditForm work={work} />
    </div>
  );
}

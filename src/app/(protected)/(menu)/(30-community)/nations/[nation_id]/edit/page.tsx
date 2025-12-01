import { NationEditForm } from "./components";

interface NationEditPageProps {
  params: Promise<{ nation_id: string }>;
}

export default async function NationEditPage({ params }: NationEditPageProps) {
  const { nation_id } = await params;

  // TODO: Fetch nation data from database
  const mockNation = {
    id: nation_id,
    name: "サンプル国",
    slug: "sample-nation",
    flagUrl: "",
    themeColor: "#3B82F6",
    constitution: "サンプルの憲法です",
  };

  return (
    <div className="container mx-auto py-8">
      <NationEditForm nation={mockNation} />
    </div>
  );
}

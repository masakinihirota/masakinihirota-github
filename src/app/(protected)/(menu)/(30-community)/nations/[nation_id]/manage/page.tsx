import { NationManage } from "./components";

interface NationManagePageProps {
  params: Promise<{ nation_id: string }>;
}

export default async function NationManagePage({ params }: NationManagePageProps) {
  const { nation_id } = await params;

  // TODO: Fetch nation and citizens from database
  const mockNation = {
    id: nation_id,
    name: "サンプル国",
  };

  const mockCitizens = [
    {
      id: "citizen-1",
      name: "山田太郎",
      avatarUrl: "",
      role: "市民",
      contribution: 500,
      stayDuration: "6ヶ月",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <NationManage nation={mockNation} citizens={mockCitizens} />
    </div>
  );
}

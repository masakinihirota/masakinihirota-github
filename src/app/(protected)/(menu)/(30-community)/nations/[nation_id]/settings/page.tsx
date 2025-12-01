import { NationSettings } from "./components";

interface NationSettingsPageProps {
  params: Promise<{ nation_id: string }>;
}

export default async function NationSettingsPage({ params }: NationSettingsPageProps) {
  const { nation_id } = await params;

  // TODO: Fetch nation from database
  const mockNation = {
    id: nation_id,
    name: "サンプル国",
    taxRate: 10,
    immigrationPolicy: "approval",
  };

  return (
    <div className="container mx-auto py-8">
      <NationSettings nation={mockNation} />
    </div>
  );
}

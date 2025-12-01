import { OrganizationSettings } from "./components";

interface OrganizationSettingsPageProps {
  params: Promise<{ org_id: string }>;
}

export default async function OrganizationSettingsPage({ params }: OrganizationSettingsPageProps) {
  const { org_id } = await params;

  // TODO: Fetch organization from database
  const mockOrganization = {
    id: org_id,
    name: "サンプル組織",
    isPublic: true,
    joinPolicy: "approval",
  };

  return (
    <div className="container mx-auto py-8">
      <OrganizationSettings organization={mockOrganization} />
    </div>
  );
}

import { OrganizationManage } from "./components";

interface OrganizationManagePageProps {
  params: Promise<{ org_id: string }>;
}

export default async function OrganizationManagePage({ params }: OrganizationManagePageProps) {
  const { org_id } = await params;

  // TODO: Fetch organization and members from database
  const mockOrganization = {
    id: org_id,
    name: "サンプル組織",
  };

  const mockMembers = [
    {
      id: "member-1",
      name: "山田太郎",
      avatarUrl: "",
      role: "リーダー",
      joinedAt: "2024-01-01",
      penaltyStatus: null,
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <OrganizationManage organization={mockOrganization} members={mockMembers} />
    </div>
  );
}

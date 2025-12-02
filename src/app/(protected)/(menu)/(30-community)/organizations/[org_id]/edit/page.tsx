import { OrganizationEditForm } from "./components";

interface OrganizationEditPageProps {
  params: Promise<{ org_id: string }>;
}

export default async function OrganizationEditPage({ params }: OrganizationEditPageProps) {
  const { org_id } = await params;

  // TODO: Fetch organization data from database
  const mockOrganization = {
    id: org_id,
    name: "サンプル組織",
    logoUrl: "",
    headerUrl: "",
    vision: "",
    location: "",
    externalLinks: [],
  };

  return (
    <div className="container mx-auto py-8">
      <OrganizationEditForm organization={mockOrganization} />
    </div>
  );
}

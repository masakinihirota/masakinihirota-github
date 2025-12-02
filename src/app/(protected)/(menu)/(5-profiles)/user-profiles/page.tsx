import * as profileComponents from "./components";

export const metadata = { title: "千の仮面（プロフィール） — masakinihirota" };

// モックデータ（後でAPI/DBから取得する）
const mockProfiles: profileComponents.Profile[] = [
  {
    id: "1",
    displayName: "田中太郎",
    role: "Designer",
    affiliation: "クリエイティブ組織A",
    matchScore: 95,
  },
  {
    id: "2",
    displayName: "佐藤花子",
    role: "Engineer",
    affiliation: "テック国B",
    matchScore: 88,
  },
  {
    id: "3",
    displayName: "鈴木一郎",
    role: "Writer",
    affiliation: "文芸組織C",
  },
];

export default function ProfilesPage() {
  return (
    <div className="container mx-auto py-6">
      <profileComponents.ProfileList profiles={mockProfiles} />
    </div>
  );
}

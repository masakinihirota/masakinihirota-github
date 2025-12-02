import { SkillDetail, SkillDetailData } from "./components/SkillDetail";

// モックデータ
const mockSkill: SkillDetailData = {
  id: "1",
  name: "TypeScript",
  category: "プログラミング",
  description:
    "TypeScriptは、JavaScriptに静的型付けを追加した言語です。大規模なアプリケーション開発において、コードの品質向上とバグの早期発見に貢献します。Microsoft社が開発し、現在では多くのプロジェクトで採用されています。",
  officialUrl: "https://www.typescriptlang.org/",
  userCount: 156,
  users: [
    { id: "u1", name: "田中太郎", level: "エキスパート", avatar: undefined },
    { id: "u2", name: "佐藤花子", level: "上級", avatar: undefined },
    { id: "u3", name: "鈴木一郎", level: "中級", avatar: undefined },
    { id: "u4", name: "高橋美咲", level: "初級", avatar: undefined },
  ],
  relatedWorks: [
    { id: "w1", title: "Webアプリケーション開発プロジェクト", authorName: "田中太郎" },
    { id: "w2", title: "業務システムリニューアル", authorName: "佐藤花子" },
    { id: "w3", title: "ECサイト構築", authorName: "鈴木一郎" },
  ],
  relatedSkills: [
    { id: "2", name: "JavaScript" },
    { id: "3", name: "React" },
    { id: "4", name: "Node.js" },
    { id: "5", name: "Next.js" },
  ],
};

interface PageProps {
  params: Promise<{ skill_id: string }>;
}

/**
 * スキル詳細ページ
 */
export default async function SkillDetailPage({ params }: PageProps) {
  const { skill_id } = await params;
  // 実際にはここでAPIからスキルデータを取得
  // const skill = await getSkill(skill_id);
  const skill = { ...mockSkill, id: skill_id };

  return <SkillDetail skill={skill} isAcquired={false} />;
}

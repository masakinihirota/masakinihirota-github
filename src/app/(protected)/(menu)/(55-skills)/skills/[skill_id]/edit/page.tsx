import { SkillEditForm, EditableSkill } from "./components/SkillEditForm";

// モックデータ
const mockSkill: EditableSkill = {
  id: "1",
  name: "TypeScript",
  category: "プログラミング",
  description:
    "TypeScriptは、JavaScriptに静的型付けを追加した言語です。大規模なアプリケーション開発において、コードの品質向上とバグの早期発見に貢献します。",
  officialUrl: "https://www.typescriptlang.org/",
};

interface PageProps {
  params: Promise<{ skill_id: string }>;
}

/**
 * スキル編集ページ
 */
export default async function SkillEditPage({ params }: PageProps) {
  const { skill_id } = await params;
  // 実際にはここでAPIからスキルデータを取得
  // const skill = await getSkill(skill_id);
  const skill = { ...mockSkill, id: skill_id };

  return <SkillEditForm skill={skill} />;
}

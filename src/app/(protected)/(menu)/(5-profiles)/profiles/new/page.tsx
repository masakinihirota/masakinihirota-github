/**
 * プロフィール新規作成ページ
 *
 * @route /profiles/new
 * @description ユーザープロフィールを新規作成するページ
 */

import { ProfileCreateForm } from "./components";

export default function ProfileCreatePage() {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <ProfileCreateForm />
    </div>
  );
}

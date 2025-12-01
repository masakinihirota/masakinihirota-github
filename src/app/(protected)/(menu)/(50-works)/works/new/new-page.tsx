import { WorkCreateForm } from "./components/WorkCreateForm";

export const metadata = { title: "作品登録 — masakinihirota" };

export default function WorkCreatePage() {
  return (
    <div className="container py-6">
      <WorkCreateForm />
    </div>
  );
}

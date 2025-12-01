import { ValueCreateForm } from "./components/ValueCreateForm";

export const metadata = { title: "価値観作成 — masakinihirota" };

export default function ValueCreatePage() {
  return (
    <div className="container py-6">
      <ValueCreateForm />
    </div>
  );
}

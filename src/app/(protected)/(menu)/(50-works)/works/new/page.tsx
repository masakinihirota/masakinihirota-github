import { CreateWorkForm } from '@/components/works/CreateWork/CreateWorkForm'

export const metadata = { title: '作品登録 — 新規' }

export default function NewWorkPage() {
    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">新しい作品を登録</h1>
            <CreateWorkForm />
        </div>
    )
}

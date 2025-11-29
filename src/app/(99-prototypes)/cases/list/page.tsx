import React from 'react';
import { CasesListRow } from './components/CasesListRow';
import { ListSkeleton } from '@/components/list-template/ListSkeleton';
import { ListEmptyState } from '@/components/list-template/ListEmptyState';
import { dummyCases } from '@/data/dummy-list-data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function CasesListPage() {
    const isLoading = false;
    const cases = dummyCases;

    return (
        <div className="container max-w-5xl py-8 mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">案件一覧</h1>
                    <p className="text-muted-foreground">手動マッチングが必要な案件の管理</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    案件を作成
                </Button>
            </div>

            {/* Filters (Mock) */}
            <div className="flex gap-2 pb-4 overflow-x-auto border-b">
                <Button variant="secondary" size="sm">すべて</Button>
                <Button variant="ghost" size="sm">優先度高</Button>
                <Button variant="ghost" size="sm">期限間近</Button>
                <Button variant="ghost" size="sm">Openのみ</Button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <ListSkeleton rows={5} />
                ) : cases.length > 0 ? (
                    <ul className="divide-y border rounded-lg bg-background" role="list">
                        {cases.map((caseItem) => (
                            <CasesListRow key={caseItem.id} caseItem={caseItem} />
                        ))}
                    </ul>
                ) : (
                    <ListEmptyState
                        message="表示できる案件がありません"
                        description="条件を変更するか、新しい案件を作成してください。"
                        actionLabel="案件を作成"
                        onAction={() => console.log('Create case')}
                    />
                )}
            </div>
        </div>
    );
}

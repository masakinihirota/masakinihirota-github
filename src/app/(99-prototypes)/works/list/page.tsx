import React from 'react';
import { WorksListRow } from './components/WorksListRow';
import { ListSkeleton } from '@/components/list-template/ListSkeleton';
import { ListEmptyState } from '@/components/list-template/ListEmptyState';
import { dummyWorks } from '@/data/dummy-list-data';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function WorksListPage() {
    // Simulate loading state (toggle this to test skeleton)
    const isLoading = false;
    const works = dummyWorks;

    return (
        <div className="container max-w-5xl py-8 mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">作品一覧</h1>
                    <p className="text-muted-foreground">登録されている作品の管理と検索</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    作品を登録
                </Button>
            </div>

            {/* Filters (Mock) */}
            <div className="flex gap-2 pb-4 overflow-x-auto border-b">
                <Button variant="secondary" size="sm">すべて</Button>
                <Button variant="ghost" size="sm">公開中</Button>
                <Button variant="ghost" size="sm">承認待ち</Button>
                <Button variant="ghost" size="sm">下書き</Button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <ListSkeleton rows={5} />
                ) : works.length > 0 ? (
                    <ul className="divide-y border rounded-lg bg-background" role="list">
                        {works.map((work) => (
                            <WorksListRow key={work.id} work={work} />
                        ))}
                    </ul>
                ) : (
                    <ListEmptyState
                        message="作品がありません"
                        description="新しい作品を登録してコレクションを始めましょう。"
                        actionLabel="作品を登録"
                        onAction={() => console.log('Create work')}
                    />
                )}
            </div>
        </div>
    );
}

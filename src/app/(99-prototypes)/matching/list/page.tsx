import React from 'react';
import { MatchingListRow } from './components/MatchingListRow';
import { ListSkeleton } from '@/components/list-template/ListSkeleton';
import { ListEmptyState } from '@/components/list-template/ListEmptyState';
import { dummyMatching } from '@/data/dummy-list-data';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function MatchingListPage() {
    const isLoading = false;
    const matches = dummyMatching;

    return (
        <div className="container max-w-4xl py-8 mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">マッチング結果</h1>
                    <p className="text-muted-foreground">あなたと価値観が合うユーザーの候補一覧</p>
                </div>
                <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    再計算
                </Button>
            </div>

            {/* Filters (Mock) */}
            <div className="flex gap-2 pb-4 overflow-x-auto border-b">
                <Button variant="secondary" size="sm">すべて</Button>
                <Button variant="ghost" size="sm">スコア順</Button>
                <Button variant="ghost" size="sm">新着</Button>
                <Button variant="ghost" size="sm">未読のみ</Button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <ListSkeleton rows={5} />
                ) : matches.length > 0 ? (
                    <ul className="divide-y border rounded-lg bg-background" role="list">
                        {matches.map((match) => (
                            <MatchingListRow key={match.id} match={match} />
                        ))}
                    </ul>
                ) : (
                    <ListEmptyState
                        message="マッチング候補がいません"
                        description="プロフィールを充実させると、より多くの候補が見つかるかもしれません。"
                        actionLabel="プロフィールを編集"
                        onAction={() => console.log('Edit profile')}
                    />
                )}
            </div>
        </div>
    );
}

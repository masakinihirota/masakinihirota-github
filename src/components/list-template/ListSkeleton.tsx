import React from 'react';

interface ListSkeletonProps {
    rows?: number;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ rows = 5 }) => {
    return (
        <div role="status" aria-live="polite" className="w-full space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
                <div className="h-8 bg-muted animate-pulse rounded w-1/3"></div>
                <div className="h-8 bg-muted animate-pulse rounded w-1/4"></div>
            </div>

            {/* Rows Skeleton */}
            <ul className="space-y-3">
                {Array.from({ length: rows }).map((_, i) => (
                    <li key={i} className="flex items-center p-4 space-x-4 border rounded-lg bg-card">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-muted animate-pulse shrink-0"></div>

                        {/* Main Content */}
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                            <div className="h-3 bg-muted animate-pulse rounded w-1/2"></div>
                        </div>

                        {/* Meta/Status */}
                        <div className="hidden sm:block w-24 h-6 bg-muted animate-pulse rounded"></div>

                        {/* Action */}
                        <div className="w-8 h-8 bg-muted animate-pulse rounded"></div>
                    </li>
                ))}
            </ul>
            <span className="sr-only">読み込み中...</span>
        </div>
    );
};

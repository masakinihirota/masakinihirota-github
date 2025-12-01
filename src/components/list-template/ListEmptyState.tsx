import React from 'react';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';

interface ListEmptyStateProps {
    message?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export const ListEmptyState: React.FC<ListEmptyStateProps> = ({
    message = "データが見つかりません",
    description = "条件を変更するか、新しいデータを作成してください。",
    actionLabel,
    onAction,
}) => {
    return (
        <div
            className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg bg-muted/10 border-muted-foreground/20 min-h-[300px]"
            role="status"
            aria-live="polite"
        >
            <div className="p-4 mb-4 rounded-full bg-muted/20">
                <FileQuestion className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="mb-2 text-lg font-semibold tracking-tight">
                {message}
            </h3>
            <p className="mb-6 text-sm text-muted-foreground max-w-[400px]">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} aria-label={actionLabel}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

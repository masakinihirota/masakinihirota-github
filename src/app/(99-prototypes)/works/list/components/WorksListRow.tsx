import React from 'react';
import { MoreHorizontal, BookOpen, Edit, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Work {
    id: string;
    title: string;
    author: string;
    period: string;
    tier: string;
    lv: number;
    status: string;
}

interface WorksListRowProps {
    work: Work;
}

export const WorksListRow: React.FC<WorksListRowProps> = ({ work }) => {
    return (
        <li className="flex items-center p-4 space-x-4 border-b bg-card hover:bg-accent/50 transition-colors focus-within:bg-accent/50" tabIndex={0} role="listitem">
            {/* 1. Small Icon (SVG Avatar) */}
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <BookOpen className="w-5 h-5" />
                </div>
            </div>

            {/* 2. Title (Main Text) */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate" title={work.title}>
                    {work.title}
                </p>
                {/* 3. Author (Sub Text) */}
                <p className="text-xs text-muted-foreground truncate">
                    {work.author}
                </p>
            </div>

            {/* 4. Period Tag */}
            <div className="hidden md:flex flex-shrink-0 w-20 justify-center">
                <Badge variant="outline" className="text-xs font-normal">
                    {work.period}
                </Badge>
            </div>

            {/* 5. Tier / LV (Subtle) */}
            <div className="hidden sm:flex flex-col items-end flex-shrink-0 w-20 space-y-1">
                <span className="text-xs font-medium">{work.tier}</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    Lv {work.lv}
                </span>
            </div>

            {/* 6. Status */}
            <div className="hidden lg:flex flex-shrink-0 w-24 justify-center">
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${work.status === 'Published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        work.status === 'Draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                    {work.status === 'Published' && <CheckCircle className="w-3 h-3" />}
                    {work.status}
                </span>
            </div>

            {/* 7. Actions */}
            <div className="flex-shrink-0">
                <Button variant="ghost" size="icon" aria-label="操作メニューを開く">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </li>
    );
};

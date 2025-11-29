import React from 'react';
import { MoreHorizontal, Users, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Case {
    id: string;
    title: string;
    author: { name: string; avatar: string };
    priority: string;
    deadline: string;
    status: string;
    candidates: number;
}

interface CasesListRowProps {
    caseItem: Case;
}

export const CasesListRow: React.FC<CasesListRowProps> = ({ caseItem }) => {
    return (
        <li className="flex items-center p-4 space-x-4 border-b bg-card hover:bg-accent/50 transition-colors focus-within:bg-accent/50" tabIndex={0} role="listitem">
            {/* 1. Title (Main Text) */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-foreground truncate" title={caseItem.title}>
                        {caseItem.title}
                    </p>
                    {caseItem.priority === 'High' && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-5">High</Badge>
                    )}
                </div>

                {/* 2. Author (Sub Text) */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <img src={caseItem.author.avatar} alt="" className="w-4 h-4 rounded-full" />
                    <span>{caseItem.author.name}</span>
                </div>
            </div>

            {/* 3. Deadline */}
            <div className="hidden sm:flex flex-col items-end flex-shrink-0 w-24 text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>期限</span>
                </div>
                <span className="text-sm font-medium tabular-nums">{caseItem.deadline}</span>
            </div>

            {/* 4. Candidates */}
            <div className="hidden md:flex flex-col items-center flex-shrink-0 w-20">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>候補</span>
                </div>
                <span className="text-sm font-bold">{caseItem.candidates}</span>
            </div>

            {/* 5. Status */}
            <div className="hidden lg:flex flex-shrink-0 w-24 justify-center">
                <Badge variant={caseItem.status === 'Open' ? 'default' : 'secondary'}>
                    {caseItem.status}
                </Badge>
            </div>

            {/* 6. Actions */}
            <div className="flex-shrink-0">
                <Button variant="ghost" size="icon" aria-label="操作メニュー">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </li>
    );
};

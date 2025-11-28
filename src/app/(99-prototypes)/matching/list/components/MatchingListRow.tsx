import React from 'react';
import { MoreHorizontal, User, Heart, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface MatchingUser {
    id: string;
    user: { name: string; avatar: string };
    valuesSummary: string;
    worksSummary: string[];
    score: number;
    lv: number;
    status: string;
}

interface MatchingListRowProps {
    match: MatchingUser;
}

export const MatchingListRow: React.FC<MatchingListRowProps> = ({ match }) => {
    return (
        <li className="flex items-start sm:items-center p-4 space-x-4 border-b bg-card hover:bg-accent/50 transition-colors focus-within:bg-accent/50" tabIndex={0} role="listitem">
            {/* 1. Avatar (SVG) */}
            <div className="flex-shrink-0 pt-1 sm:pt-0">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden border">
                    <img src={match.user.avatar} alt="" className="w-full h-full object-cover" />
                </div>
            </div>

            {/* 2. User Name & 3. Values Summary */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-foreground truncate">
                        {match.user.name}
                    </p>
                    <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        Lv {match.lv}
                    </span>
                </div>

                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span className="truncate">{match.valuesSummary}</span>
                </div>

                {/* 4. Works Summary */}
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Film className="w-3 h-3 text-blue-400" />
                    <span className="truncate">{match.worksSummary.join(', ')}</span>
                </div>
            </div>

            {/* 5. Score */}
            <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-primary/5 border border-primary/10 flex-shrink-0">
                <span className="text-2xl font-bold text-primary">{match.score}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</span>
            </div>

            {/* 6. Actions */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row gap-2">
                <Button size="sm" variant="default">招待</Button>
                <Button variant="ghost" size="icon" aria-label="詳細メニュー">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </div>
        </li>
    );
};

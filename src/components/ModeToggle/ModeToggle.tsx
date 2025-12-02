"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

/**
 * テーマ切り替えトグルボタン
 * ダークモードとライトモードを切り替えます
 */
export function ModeToggle() {
    // resolvedTheme gives the effective theme when `theme` may be 'system'
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    // Avoid theme mismatch / hydration flash — only render toggle after mount
    if (!mounted) {
        return (
            <Button variant="outline" size="icon" aria-hidden>
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    const current = resolvedTheme ?? theme ?? 'light';

    const handleClick = () => {
        const next = current === 'light' ? 'dark' : 'light';
        // use next-themes to persist / manage theme
        setTheme(next);
        // defensive fallback: ensure the class on documentElement is set so CSS that relies
        // on `.dark` (or `.light`) works even if next-themes cannot toggle immediately.
        try {
            if (typeof document !== 'undefined' && document.documentElement) {
                document.documentElement.classList.toggle('dark', next === 'dark');
                document.documentElement.classList.toggle('light', next === 'light');
            }
        } catch (e) {
            // silent fallback
        }
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleClick}
            aria-pressed={current === 'dark'}
            aria-label="切り替え: ダーク/ライト"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}

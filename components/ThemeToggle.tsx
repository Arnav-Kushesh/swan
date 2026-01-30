'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { css } from '@/styled-system/css';

export function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check local storage or DOM state set by blocking script
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme');
            if (stored) {
                setTheme(stored as 'light' | 'dark');
            } else {
                // Determine from class set by blocking script
                const isDark = document.documentElement.classList.contains('dark');
                setTheme(isDark ? 'dark' : 'light');
            }
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'light');
        }
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className={css({
                p: '8px',
                borderRadius: 'full',
                color: 'text.secondary',
                transition: 'all 0.2s',
                cursor: 'pointer',
                _hover: {
                    bg: 'bg.secondary',
                    color: 'text.primary',
                },
            })}
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon size={20} />
            ) : (
                <Sun size={20} />
            )}
        </button>
    );
}

"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HomeData } from '@/lib/data';

interface SearchItem {
    slug: string;
    title: string;
    description: string;
    collection: string;
    tags?: string[];
}

interface GlobalConfigContextType {
    config: HomeData;
    colorMode: string;
    setColorMode: (mode: string) => void;
    availableThemes: string[];
    showSidebar: boolean;
    toggleSidebar: () => void;
    isSearchOpen: boolean;
    toggleSearch: () => void;
    searchIndex: SearchItem[];
}

const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

export const THEMES = [
    'light', 'dark', 'blue', 'pink', 'red', 'green', 'brown'
];

export function GlobalConfigProvider({
    initialConfig,
    searchIndex = [],
    children
}: {
    initialConfig: HomeData;
    searchIndex?: SearchItem[];
    children: React.ReactNode;
}) {
    const [colorMode, setColorMode] = useState<string>((initialConfig.info?.default_color_mode as string) || 'light');
    const [showSidebar, setShowSidebar] = useState<boolean>(initialConfig.info?.sidebar_navigation === 'true');
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);

    useEffect(() => {
        const saved = localStorage.getItem('swan-color-mode');
        if (saved && THEMES.includes(saved)) {
            setColorMode(saved);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorMode);
        localStorage.setItem('swan-color-mode', colorMode);
    }, [colorMode]);

    // Global Cmd+K / Ctrl+K shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                toggleSearch();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [toggleSearch]);

    return (
        <GlobalConfigContext.Provider value={{
            config: initialConfig,
            colorMode,
            setColorMode,
            availableThemes: THEMES,
            showSidebar,
            toggleSidebar,
            isSearchOpen,
            toggleSearch,
            searchIndex,
        }}>
            {children}
        </GlobalConfigContext.Provider>
    );
}

export function useGlobalConfig() {
    const context = useContext(GlobalConfigContext);
    if (context === undefined) {
        throw new Error('useGlobalConfig must be used within a GlobalConfigProvider');
    }
    return context;
}

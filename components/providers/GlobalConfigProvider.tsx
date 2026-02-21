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
    setColorModeTemporary: (mode: string) => void;
    availableThemes: string[];
    showSidebar: boolean;
    toggleSidebar: () => void;
    setSidebarTemporary: (show: boolean) => void;
    isSearchOpen: boolean;
    toggleSearch: () => void;
    searchIndex: SearchItem[];
    sectionViewOverrides: Record<string, string>;
    setSectionViewOverride: (sectionId: string, viewType: string) => void;
}

const GlobalConfigContext = createContext<GlobalConfigContextType | undefined>(undefined);

export const LIGHT_THEMES = ['light', 'cream', 'pink'];
export const DARK_THEMES = ['dark', 'blue', 'purple', 'red', 'green'];
export const THEMES = [...LIGHT_THEMES, ...DARK_THEMES];

export function GlobalConfigProvider({
    initialConfig,
    searchIndex = [],
    allowedThemes: allowedThemesProp,
    children
}: {
    initialConfig: HomeData;
    searchIndex?: SearchItem[];
    allowedThemes?: string[];
    children: React.ReactNode;
}) {
    const [colorMode, setColorMode] = useState<string>((initialConfig.info?.default_color_mode as string) || 'light');
    const [showSidebar, setShowSidebar] = useState<boolean>(initialConfig.info?.sidebar_navigation === 'true');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [sectionViewOverrides, setSectionViewOverrides] = useState<Record<string, string>>({});

    // Filter themes by allowedThemes if provided
    const effectiveThemes = allowedThemesProp && allowedThemesProp.length > 0
        ? THEMES.filter(t => allowedThemesProp.includes(t))
        : THEMES;

    const toggleSidebar = () => setShowSidebar(prev => !prev);
    const setSidebarTemporary = (show: boolean) => setShowSidebar(show);
    const toggleSearch = useCallback(() => setIsSearchOpen(prev => !prev), []);
    const setSectionViewOverride = (sectionId: string, viewType: string) => {
        setSectionViewOverrides(prev => ({ ...prev, [sectionId]: viewType }));
    };

    // Temporary color mode change (no localStorage persistence)
    const setColorModeTemporary = (mode: string) => {
        setColorMode(mode);
        // Remove from localStorage so it won't persist after refresh
        localStorage.removeItem('swan-color-mode');
    };

    useEffect(() => {
        const saved = localStorage.getItem('swan-color-mode');
        if (saved && effectiveThemes.includes(saved)) {
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
            setColorModeTemporary,
            availableThemes: effectiveThemes,
            showSidebar,
            toggleSidebar,
            setSidebarTemporary,
            isSearchOpen,
            toggleSearch,
            searchIndex,
            sectionViewOverrides,
            setSectionViewOverride,
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

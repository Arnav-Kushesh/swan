'use client';

import React from 'react';
import { css } from '@/styled-system/css';
import { Search } from 'lucide-react';
import { useGlobalConfig } from './providers/GlobalConfigProvider';
import { SearchModal } from './SearchModal';

export function SearchButton() {
    const { isSearchOpen, toggleSearch, searchIndex } = useGlobalConfig();

    return (
        <>
            <button
                onClick={toggleSearch}
                aria-label="Search"
                title="Search (⌘K)"
                className={css({
                    cursor: 'pointer',
                    p: '6px',
                    borderRadius: 'md',
                    bg: 'transparent',
                    border: 'none',
                    color: 'text.secondary',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    _hover: { color: 'text.primary', bg: 'bg.tertiary' },
                })}
            >
                <Search size={18} />
            </button>
            <SearchModal
                items={searchIndex}
                isOpen={isSearchOpen}
                onClose={toggleSearch}
            />
        </>
    );
}

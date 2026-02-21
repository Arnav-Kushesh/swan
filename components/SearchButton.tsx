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
                    borderRadius: '8px',
                    bg: 'transparent',
                    border: 'none',
                    color: 'text.primary',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    _hover: { bg: 'bg.secondary' },
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

'use client';

import React, { useState } from 'react';
import { css } from '../styled-system/css';
import { Post, GalleryItem } from '../lib/data';
import { GridView } from './views/GridView';
import { CardView } from './views/CardView';
import { TinyCardView } from './views/TinyCardView';
import { BigCardView } from './views/BigCardView';
import { ListView } from './views/ListView';

const DEFAULT_ITEMS_PER_PAGE = 6;

interface GenericListProps {
    items: (Post | GalleryItem)[];
    viewType: string;
    itemsPerPage?: number;
}

export function GenericList({ items, viewType, itemsPerPage }: GenericListProps) {
    const perPage = itemsPerPage || DEFAULT_ITEMS_PER_PAGE;
    const [visibleCount, setVisibleCount] = useState(perPage);
    const visibleItems = items.slice(0, visibleCount);
    const hasMore = visibleCount < items.length;

    const loadMore = () => setVisibleCount(prev => prev + perPage);

    const paginationButton = hasMore ? (
        <div className={css({ display: 'flex', justifyContent: 'center', mt: '32px' })}>
            <button
                onClick={loadMore}
                className={css({
                    px: '24px',
                    py: '10px',
                    borderRadius: 'full',
                    border: '1px solid token(colors.border.default)',
                    bg: 'transparent',
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    _hover: { bg: 'bg.secondary', color: 'text.primary', borderColor: 'text.tertiary' },
                })}
            >
                Show More ({items.length - visibleCount} remaining)
            </button>
        </div>
    ) : null;

    const viewProps = { visibleItems, paginationButton };

    if (viewType === 'grid_view') return <GridView {...viewProps} />;
    if (viewType === 'card_view') return <CardView {...viewProps} />;
    if (viewType === 'tiny_card_view') return <TinyCardView {...viewProps} />;
    if (viewType === 'big_card_view') return <BigCardView {...viewProps} />;

    // Default: List View (minimal_list_view or list_view)
    return <ListView {...viewProps} isMinimal={viewType === 'minimal_list_view'} />;
}

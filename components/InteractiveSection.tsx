'use client';

import React from 'react';
import { css } from '../styled-system/css';
import { GenericList } from './GenericList';
import { useGlobalConfig } from './providers/GlobalConfigProvider';

interface InteractiveSectionProps {
    sectionId?: string;
    title: string;
    description?: string;
    items: any[];
    initialViewType: string;
    itemsPerPage?: number;
    centered?: boolean;
}

export function InteractiveSection({ sectionId, title, description, items, initialViewType, itemsPerPage, centered }: InteractiveSectionProps) {
    const { sectionViewOverrides } = useGlobalConfig();
    const effectiveViewType = (sectionId && sectionViewOverrides[sectionId]) || initialViewType;

    return (
        <section className={css({ mb: '40px' })}>
            <div className={css({
                display: 'flex',
                flexDirection: 'column',
                alignItems: centered ? 'center' : 'flex-start',
                textAlign: centered ? 'center' : 'left',
                mb: '24px',
            })}>
                <h2 className={css({ fontSize: '1.5rem', fontWeight: '700', color: 'text.primary', letterSpacing: '-0.02em' })}>
                    {title}
                </h2>
                {description && (
                    <p className={css({ color: 'text.secondary', fontSize: '0.875rem', mt: '4px', maxWidth: centered ? '600px' : 'none' })}>{description}</p>
                )}
            </div>

            <GenericList items={items} viewType={effectiveViewType} itemsPerPage={itemsPerPage} />
        </section>
    );
}

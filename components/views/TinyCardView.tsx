'use client';

import React from 'react';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import { Post } from '../../lib/data';
import { ViewProps, getItemTitle, getItemHref, getItemImage } from './shared';

export function TinyCardView({ visibleItems, paginationButton }: ViewProps) {
    return (
        <>
            <div className={css({
                display: 'grid',
                gridTemplateColumns: { base: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
                gap: '8px',
                width: '100%',
            })}>
                {visibleItems.map((item) => {
                    const image = getItemImage(item);
                    return (
                        <Link
                            key={item.slug}
                            href={getItemHref(item)}
                            className={css({
                                display: 'block',
                                position: 'relative',
                                aspectRatio: 'square',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid token(colors.border.default)',
                                transition: 'all 0.2s ease',
                                _hover: { transform: 'scale(1.03)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                            })}
                        >
                            {image ? (
                                <>
                                    <img
                                        src={image}
                                        alt={getItemTitle(item)}
                                        className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                    />
                                    {(item as Post).video_embed_url && (
                                        <div className={css({
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: 'full',
                                            bg: 'rgba(0,0,0,0.55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.8rem',
                                            backdropFilter: 'blur(4px)',
                                        })}>
                                            ▶
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={css({ width: '100%', height: '100%', bg: 'bg.secondary' })} />
                            )}
                        </Link>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}

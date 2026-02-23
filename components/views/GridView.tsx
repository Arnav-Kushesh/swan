'use client';

import React from 'react';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import { Post } from '../../lib/data';
import { ViewProps, getItemTitle, getItemHref, getItemImage } from './shared';

export function GridView({ visibleItems, paginationButton }: ViewProps) {
    return (
        <>
            <div className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: '16px',
                width: '100%',
            })}>
                {visibleItems.map((item) => {
                    const post = item as Post;
                    const hasVideo = post.video_embed_url;
                    const title = getItemTitle(item);

                    return (
                        <Link
                            key={item.slug}
                            href={getItemHref(item)}
                            className={css({
                                display: 'block',
                                position: 'relative',
                                aspectRatio: 'square',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid token(colors.border.default)',
                                transition: 'all 0.2s ease',
                                _hover: { transform: 'translateY(-2px)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                            })}
                        >
                            {getItemImage(item) ? (
                                <>
                                    <img
                                        src={getItemImage(item)}
                                        alt={title}
                                        className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                    />
                                    {hasVideo && (
                                        <div className={css({
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: 'full',
                                            bg: 'rgba(0,0,0,0.55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.1rem',
                                            backdropFilter: 'blur(4px)',
                                        })}>
                                            ▶
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={css({ width: '100%', height: '100%', bg: 'bg.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.tertiary', fontSize: '0.875rem' })}>
                                    No image
                                </div>
                            )}
                            <div className={css({
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: '16px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
                                color: 'white',
                            })}>
                                <h3 className={css({ fontWeight: '600', fontSize: '0.95rem', lineHeight: '1.3' })}>
                                    {title}
                                </h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import { Post } from '../../lib/data';
import { format } from 'date-fns';
import { ViewProps, getItemTitle, getItemHref, getItemImage } from './shared';

interface ListViewProps extends ViewProps {
    isMinimal: boolean;
}

export function ListView({ visibleItems, paginationButton, isMinimal }: ListViewProps) {
    return (
        <>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '12px' })}>
                {visibleItems.map((item) => {
                    const post = item as Post;
                    const title = getItemTitle(item);
                    const image = getItemImage(item);

                    return (
                        <Link
                            key={item.slug}
                            href={getItemHref(item)}
                            className={css({
                                display: 'flex',
                                flexDirection: { base: 'column', sm: 'row' },
                                gap: '24px',
                                p: '20px',
                                borderRadius: '12px',
                                border: '1px solid token(colors.border.default)',
                                bg: 'transparent',
                                transition: 'all 0.2s ease',
                                _hover: { bg: 'bg.secondary', borderColor: 'text.tertiary', transform: 'translateY(-1px)' },
                            })}
                        >
                            {!isMinimal && image && (
                                <div className={css({
                                    position: 'relative',
                                    aspectRatio: 1,
                                    height: { base: '180px', sm: '110px' },
                                    flexShrink: 0,
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                })}>
                                    <img
                                        src={image}
                                        alt={title}
                                        className={css({ width: '100%', height: '100%', objectFit: 'cover' })}
                                    />
                                    {post.video_embed_url && (
                                        <div className={css({
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: 'full',
                                            bg: 'rgba(0,0,0,0.55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '0.9rem',
                                            backdropFilter: 'blur(4px)',
                                        })}>
                                            ▶
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className={css({ flex: 1, minWidth: 0 })}>
                                <h3 className={css({ fontWeight: '600', fontSize: '1.15rem', color: 'text.primary', truncate: true, mb: '4px' })}>
                                    {title}
                                </h3>
                                {post.description && (
                                    <p className={css({ color: 'text.secondary', fontSize: '0.95rem', lineClamp: 2, lineHeight: '1.5' })}>
                                        {post.description}
                                    </p>
                                )}
                            </div>
                            <div className={css({
                                fontSize: '0.85rem',
                                color: 'text.tertiary',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                alignSelf: { base: 'flex-start', sm: 'flex-start' },
                            })}>
                                {post.date && format(new Date(post.date), 'MMM d, yyyy')}
                            </div>
                        </Link>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { css } from '../../styled-system/css';
import { Post } from '../../lib/data';
import { ViewProps, getItemTitle, getItemHref, getItemImage } from './shared';

export function BigCardView({ visibleItems, paginationButton }: ViewProps) {
    return (
        <>
            <div className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
                gap: '24px',
                width: '100%',
            })}>
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
                                flexDirection: 'column',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                bg: 'bg.secondary',
                                border: '1px solid token(colors.border.default)',
                                transition: 'all 0.2s ease',
                                _hover: { transform: 'translateY(-3px)', borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)' },
                            })}
                        >
                            {image && (
                                <div className={css({ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' })}>
                                    <img
                                        src={image}
                                        alt={title}
                                        className={css({
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        })}
                                    />
                                    {post.video_embed_url && (
                                        <div className={css({
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'full',
                                            bg: 'rgba(0,0,0,0.55)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.2rem',
                                            backdropFilter: 'blur(4px)',
                                        })}>
                                            ▶
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className={css({ p: '20px', display: 'flex', flexDirection: 'column', gap: '8px' })}>
                                <h3 className={css({
                                    fontWeight: '700',
                                    fontSize: '1.2rem',
                                    lineHeight: '1.3',
                                    color: 'text.primary',
                                })}>
                                    {title}
                                </h3>
                                {post.description && (
                                    <p className={css({ color: 'text.secondary', fontSize: '0.9rem', lineHeight: '1.5', lineClamp: 3 })}>
                                        {post.description}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}

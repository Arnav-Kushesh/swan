'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { css } from '../../styled-system/css';
import { Post } from '../../lib/data';
import { ViewProps, getItemTitle, getItemHref, getItemImage, getTagName } from './shared';

export function CardView({ visibleItems, paginationButton }: ViewProps) {
    const router = useRouter();

    return (
        <>
            <div className={css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: '20px',
                width: '100%',
            })}>
                {visibleItems.map((item) => {
                    const post = item as Post;
                    const hasVideo = post.video_embed_url;
                    const title = getItemTitle(item);
                    const image = getItemImage(item);

                    return (
                        <div
                            key={item.slug}
                            role="link"
                            tabIndex={0}
                            onClick={() => router.push(getItemHref(item))}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(getItemHref(item)); } }}
                            className={css({
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '12px',
                                bg: 'bg.secondary',
                                border: '1px solid token(colors.border.default)',
                                overflow: 'hidden',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer',
                                _hover: { borderColor: 'color-mix(in srgb, token(colors.primary) 45%, transparent)', transform: 'translateY(-2px)' },
                                _focus: { outline: '2px solid token(colors.primary)', outlineOffset: '2px' },
                            })}
                        >
                            {image ? (
                                <div className={css({ aspectRatio: '16/9', overflow: 'hidden', position: 'relative' })}>
                                    <img
                                        src={image}
                                        alt={title}
                                        className={css({
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease',
                                        })}
                                    />
                                    {hasVideo && (
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
                            ) : null}
                            <div className={css({ p: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' })}>
                                <h3 className={css({ fontWeight: '600', fontSize: '1.05rem', lineHeight: '1.3', color: 'text.primary' })}>
                                    {title}
                                </h3>
                                {post.description && (
                                    <p className={css({ color: 'text.secondary', fontSize: '0.85rem', lineHeight: '1.5', lineClamp: 2 })}>
                                        {post.description}
                                    </p>
                                )}
                                {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                                    <div className={css({ display: 'flex', gap: '6px', flexWrap: 'wrap', mt: 'auto', pt: '8px' })}>
                                        {post.tags.slice(0, 3).map(tag => {
                                            const name = getTagName(tag);
                                            return (
                                                <Link
                                                    key={name}
                                                    href={`/tag/${encodeURIComponent(name)}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className={css({
                                                        fontSize: '0.7rem',
                                                        bg: 'bg.tertiary',
                                                        color: 'text.secondary',
                                                        px: '8px',
                                                        py: '3px',
                                                        borderRadius: 'full',
                                                        transition: 'all 0.15s ease',
                                                        position: 'relative',
                                                        zIndex: 1,
                                                        _hover: { bg: 'primary', color: 'white' },
                                                    })}
                                                >
                                                    {name}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            {paginationButton}
        </>
    );
}
